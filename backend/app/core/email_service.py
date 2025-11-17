"""
Email service for sending verification and notification emails
"""

from typing import Optional
import secrets
from datetime import datetime, timedelta
from app.core.config import settings


class EmailService:
    """Email service using SendGrid or SMTP fallback"""

    def __init__(self):
        self.from_email = settings.FROM_EMAIL
        self.sendgrid_api_key = settings.SENDGRID_API_KEY
        self.frontend_url = settings.FRONTEND_URL

    async def send_verification_email(self, email: str, token: str) -> bool:
        """Send email verification link"""
        verification_url = f"{self.frontend_url}/verify-email?token={token}"

        subject = "LexiKor 이메일 인증"
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body {{ font-family: 'Noto Sans KR', sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .button {{ display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>⚖️ LexiKor</h1>
                    <p>한국형 법률 AI 플랫폼</p>
                </div>
                <div class="content">
                    <h2>이메일 인증</h2>
                    <p>LexiKor에 가입해주셔서 감사합니다!</p>
                    <p>아래 버튼을 클릭하여 이메일 주소를 인증해주세요:</p>
                    <p style="text-align: center;">
                        <a href="{verification_url}" class="button">이메일 인증하기</a>
                    </p>
                    <p>또는 다음 링크를 복사하여 브라우저에 붙여넣으세요:</p>
                    <p style="word-break: break-all; background: #fff; padding: 10px; border-radius: 5px;">
                        {verification_url}
                    </p>
                    <p style="color: #666; font-size: 14px;">
                        ※ 이 링크는 24시간 동안 유효합니다.<br>
                        ※ 본인이 요청하지 않은 경우 이 메일을 무시하세요.
                    </p>
                </div>
                <div class="footer">
                    <p>© 2024 LexiKor. All rights reserved.</p>
                    <p>본 메일은 발신 전용입니다. 문의사항은 support@lexikor.ai로 연락주세요.</p>
                </div>
            </div>
        </body>
        </html>
        """

        return await self._send_email(email, subject, html_content)

    async def send_password_reset_email(self, email: str, token: str) -> bool:
        """Send password reset link"""
        reset_url = f"{self.frontend_url}/reset-password?token={token}"

        subject = "LexiKor 비밀번호 재설정"
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body {{ font-family: 'Noto Sans KR', sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .button {{ display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                .warning {{ background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔒 비밀번호 재설정</h1>
                </div>
                <div class="content">
                    <p>비밀번호 재설정 요청을 받았습니다.</p>
                    <p>아래 버튼을 클릭하여 새로운 비밀번호를 설정하세요:</p>
                    <p style="text-align: center;">
                        <a href="{reset_url}" class="button">비밀번호 재설정하기</a>
                    </p>
                    <p>또는 다음 링크를 복사하여 브라우저에 붙여넣으세요:</p>
                    <p style="word-break: break-all; background: #fff; padding: 10px; border-radius: 5px;">
                        {reset_url}
                    </p>
                    <div class="warning">
                        <strong>⚠️ 보안 안내</strong>
                        <ul>
                            <li>이 링크는 1시간 동안만 유효합니다</li>
                            <li>본인이 요청하지 않은 경우 즉시 비밀번호를 변경하세요</li>
                            <li>비밀번호는 타인과 절대 공유하지 마세요</li>
                        </ul>
                    </div>
                </div>
                <div class="footer" style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
                    <p>© 2024 LexiKor. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """

        return await self._send_email(email, subject, html_content)

    async def send_welcome_email(self, email: str, full_name: str) -> bool:
        """Send welcome email after verification"""
        subject = "LexiKor에 오신 것을 환영합니다!"
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body {{ font-family: 'Noto Sans KR', sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .feature {{ background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #667eea; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 환영합니다!</h1>
                </div>
                <div class="content">
                    <h2>안녕하세요, {full_name}님!</h2>
                    <p>LexiKor 법률 AI 플랫폼에 가입하신 것을 진심으로 환영합니다.</p>

                    <h3>🚀 시작하기</h3>
                    <div class="feature">
                        <strong>💬 AI 법률 상담</strong>
                        <p>GPT-4 기반 AI와 법률 문제를 상담하세요</p>
                    </div>
                    <div class="feature">
                        <strong>📄 문서 관리</strong>
                        <p>계약서, 소장 등 법률 문서를 업로드하고 분석하세요</p>
                    </div>
                    <div class="feature">
                        <strong>🔍 판례 검색</strong>
                        <p>방대한 판례와 법령 데이터베이스를 검색하세요</p>
                    </div>
                    <div class="feature">
                        <strong>📝 문서 생성</strong>
                        <p>전문 템플릿으로 법률 문서를 자동 생성하세요</p>
                    </div>

                    <p style="text-align: center; margin-top: 30px;">
                        <a href="{self.frontend_url}/dashboard" style="display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px;">
                            대시보드로 이동
                        </a>
                    </p>

                    <p style="margin-top: 30px; color: #666; font-size: 14px;">
                        궁금한 점이 있으시면 언제든지 support@lexikor.ai로 문의해주세요.
                    </p>
                </div>
                <div class="footer" style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
                    <p>© 2024 LexiKor. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """

        return await self._send_email(email, subject, html_content)

    async def _send_email(self, to_email: str, subject: str, html_content: str) -> bool:
        """Send email via SendGrid or log to console"""
        if self.sendgrid_api_key:
            try:
                import sendgrid
                from sendgrid.helpers.mail import Mail, Email, To, Content

                sg = sendgrid.SendGridAPIClient(api_key=self.sendgrid_api_key)
                message = Mail(
                    from_email=Email(self.from_email),
                    to_emails=To(to_email),
                    subject=subject,
                    html_content=Content("text/html", html_content)
                )

                response = sg.send(message)
                return response.status_code in [200, 201, 202]
            except Exception as e:
                print(f"Failed to send email via SendGrid: {e}")
                return False
        else:
            # Development mode: print to console
            print(f"\n{'='*80}")
            print(f"📧 EMAIL (Development Mode)")
            print(f"To: {to_email}")
            print(f"Subject: {subject}")
            print(f"{'='*80}\n")
            print(html_content[:500] + "..." if len(html_content) > 500 else html_content)
            print(f"\n{'='*80}\n")
            return True


def generate_token() -> str:
    """Generate secure random token"""
    return secrets.token_urlsafe(32)


def generate_verification_token() -> tuple[str, datetime]:
    """Generate email verification token with expiry"""
    token = generate_token()
    expires_at = datetime.utcnow() + timedelta(hours=24)
    return token, expires_at


def generate_reset_token() -> tuple[str, datetime]:
    """Generate password reset token with expiry"""
    token = generate_token()
    expires_at = datetime.utcnow() + timedelta(hours=1)
    return token, expires_at
