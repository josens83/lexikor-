"""Add email verification and password reset tokens

Revision ID: 002_add_email_verification
Revises: 001_initial
Create Date: 2024-01-15 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '002_add_email_verification'
down_revision = '001_initial'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add email verification token fields
    op.add_column('users', sa.Column('email_verification_token', sa.String(), nullable=True))
    op.add_column('users', sa.Column('email_verification_token_expires', sa.DateTime(timezone=True), nullable=True))

    # Add password reset token fields
    op.add_column('users', sa.Column('password_reset_token', sa.String(), nullable=True))
    op.add_column('users', sa.Column('password_reset_token_expires', sa.DateTime(timezone=True), nullable=True))


def downgrade() -> None:
    # Remove password reset token fields
    op.drop_column('users', 'password_reset_token_expires')
    op.drop_column('users', 'password_reset_token')

    # Remove email verification token fields
    op.drop_column('users', 'email_verification_token_expires')
    op.drop_column('users', 'email_verification_token')
