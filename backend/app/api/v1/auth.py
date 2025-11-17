"""
Authentication API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.db.session import get_db
from app.models.user import User, UserRole
from app.models.subscription import Subscription, SubscriptionPlan, SubscriptionStatus
from app.core.config import settings
from app.core.email_service import EmailService, generate_verification_token, generate_reset_token

router = APIRouter()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_PREFIX}/auth/login")


# Pydantic models
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    phone: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str]
    role: UserRole
    is_active: bool
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: Optional[str] = None


# Helper functions
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash password"""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt


def create_refresh_token(data: dict):
    """Create JWT refresh token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    """Get current authenticated user"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception

    result = await db.execute(select(User).where(User.email == token_data.email))
    user = result.scalar_one_or_none()

    if user is None:
        raise credentials_exception

    return user


async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """Get current active user"""
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


# API Endpoints
@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    """
    Register a new user
    """
    # Check if user already exists
    result = await db.execute(select(User).where(User.email == user_data.email))
    existing_user = result.scalar_one_or_none()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user
    hashed_password = get_password_hash(user_data.password)

    # Generate email verification token
    verification_token, token_expires = generate_verification_token()

    new_user = User(
        email=user_data.email,
        hashed_password=hashed_password,
        full_name=user_data.full_name,
        phone=user_data.phone,
        role=UserRole.USER,
        is_active=True,
        is_verified=False,
        email_verification_token=verification_token,
        email_verification_token_expires=token_expires
    )

    db.add(new_user)
    await db.flush()

    # Create free subscription
    subscription = Subscription(
        plan=SubscriptionPlan.FREE,
        status=SubscriptionStatus.TRIAL,
        query_limit=settings.FREE_PLAN_QUERY_LIMIT,
        queries_used=0,
        document_limit=5,
        documents_count=0,
        price=0,
        trial_ends_at=datetime.utcnow() + timedelta(days=14)
    )

    db.add(subscription)
    await db.flush()

    new_user.subscription_id = subscription.id
    await db.commit()
    await db.refresh(new_user)

    # Send verification email
    email_service = EmailService()
    try:
        await email_service.send_verification_email(new_user.email, verification_token)
    except Exception as e:
        print(f"Failed to send verification email: {e}")
        # Don't fail registration if email fails

    return new_user


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    """
    Login and get access token
    """
    # Find user
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalar_one_or_none()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )

    # Create tokens
    access_token = create_access_token(data={"sub": user.email})
    refresh_token = create_refresh_token(data={"sub": user.email})

    # Update last login
    user.last_login = datetime.utcnow()
    await db.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_active_user)):
    """
    Get current user information
    """
    return current_user


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_active_user)):
    """
    Logout user (client should delete the token)
    """
    return {"message": "Successfully logged out"}


# Settings endpoints
class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None


class PasswordChange(BaseModel):
    current_password: str
    new_password: str


@router.put("/me", response_model=UserResponse)
async def update_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update user profile
    """
    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name

    if user_update.phone is not None:
        current_user.phone = user_update.phone

    current_user.updated_at = datetime.utcnow()

    await db.commit()
    await db.refresh(current_user)

    return current_user


@router.post("/change-password")
async def change_password(
    password_data: PasswordChange,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Change user password
    """
    # Verify current password
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )

    # Validate new password
    if len(password_data.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 8 characters"
        )

    # Update password
    current_user.hashed_password = get_password_hash(password_data.new_password)
    current_user.updated_at = datetime.utcnow()

    await db.commit()

    return {"message": "Password changed successfully"}


@router.post("/toggle-mfa")
async def toggle_mfa(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Toggle MFA (Two-Factor Authentication)
    """
    current_user.mfa_enabled = not current_user.mfa_enabled
    current_user.updated_at = datetime.utcnow()

    await db.commit()

    return {
        "mfa_enabled": current_user.mfa_enabled,
        "message": f"MFA {'enabled' if current_user.mfa_enabled else 'disabled'} successfully"
    }


@router.delete("/me")
async def delete_account(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Delete user account
    """
    # Soft delete - mark as inactive
    current_user.is_active = False
    current_user.updated_at = datetime.utcnow()

    await db.commit()

    return {"message": "Account deleted successfully"}


# Email verification endpoints
class EmailVerificationRequest(BaseModel):
    token: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


@router.post("/verify-email")
async def verify_email(
    request: EmailVerificationRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Verify user email with token
    """
    # Find user with verification token
    result = await db.execute(
        select(User).where(User.email_verification_token == request.token)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification token"
        )

    # Check if token expired
    if user.email_verification_token_expires < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification token has expired. Please request a new one."
        )

    # Mark user as verified
    user.is_verified = True
    user.email_verification_token = None
    user.email_verification_token_expires = None
    user.updated_at = datetime.utcnow()

    await db.commit()

    # Send welcome email
    email_service = EmailService()
    try:
        await email_service.send_welcome_email(user.email, user.full_name or "")
    except Exception as e:
        print(f"Failed to send welcome email: {e}")

    return {"message": "Email verified successfully"}


@router.post("/resend-verification")
async def resend_verification(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Resend verification email
    """
    if current_user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already verified"
        )

    # Generate new verification token
    verification_token, token_expires = generate_verification_token()

    current_user.email_verification_token = verification_token
    current_user.email_verification_token_expires = token_expires
    current_user.updated_at = datetime.utcnow()

    await db.commit()

    # Send verification email
    email_service = EmailService()
    try:
        await email_service.send_verification_email(current_user.email, verification_token)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send verification email: {str(e)}"
        )

    return {"message": "Verification email sent successfully"}


@router.post("/forgot-password")
async def forgot_password(
    request: ForgotPasswordRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Request password reset
    """
    # Find user by email
    result = await db.execute(select(User).where(User.email == request.email))
    user = result.scalar_one_or_none()

    # Always return success to prevent email enumeration
    if not user:
        return {"message": "If the email exists, a password reset link has been sent"}

    # Generate password reset token
    reset_token, token_expires = generate_reset_token()

    user.password_reset_token = reset_token
    user.password_reset_token_expires = token_expires
    user.updated_at = datetime.utcnow()

    await db.commit()

    # Send password reset email
    email_service = EmailService()
    try:
        await email_service.send_password_reset_email(user.email, reset_token)
    except Exception as e:
        print(f"Failed to send password reset email: {e}")

    return {"message": "If the email exists, a password reset link has been sent"}


@router.post("/reset-password")
async def reset_password(
    request: ResetPasswordRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Reset password with token
    """
    # Find user with reset token
    result = await db.execute(
        select(User).where(User.password_reset_token == request.token)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid reset token"
        )

    # Check if token expired
    if user.password_reset_token_expires < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset token has expired. Please request a new one."
        )

    # Validate new password
    if len(request.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters"
        )

    # Update password
    user.hashed_password = get_password_hash(request.new_password)
    user.password_reset_token = None
    user.password_reset_token_expires = None
    user.updated_at = datetime.utcnow()

    await db.commit()

    return {"message": "Password reset successfully"}
