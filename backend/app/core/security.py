"""
Security middleware and utilities
"""

from fastapi import Request, HTTPException, status
from fastapi.responses import Response
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Dict, Optional
import time
from collections import defaultdict
from datetime import datetime, timedelta


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Simple in-memory rate limiting middleware
    In production, use Redis for distributed rate limiting
    """

    def __init__(self, app, requests_per_minute: int = 60):
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        self.requests: Dict[str, list] = defaultdict(list)

    async def dispatch(self, request: Request, call_next):
        # Skip rate limiting for health checks
        if request.url.path == "/health":
            return await call_next(request)

        # Get client IP
        client_ip = request.client.host

        # Clean up old requests (older than 1 minute)
        current_time = time.time()
        self.requests[client_ip] = [
            req_time for req_time in self.requests[client_ip]
            if current_time - req_time < 60
        ]

        # Check rate limit
        if len(self.requests[client_ip]) >= self.requests_per_minute:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please try again later."
            )

        # Add current request
        self.requests[client_ip].append(current_time)

        # Process request
        response = await call_next(request)

        # Add rate limit headers
        response.headers["X-RateLimit-Limit"] = str(self.requests_per_minute)
        response.headers["X-RateLimit-Remaining"] = str(
            max(0, self.requests_per_minute - len(self.requests[client_ip]))
        )

        return response


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Add security headers to all responses
    """

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        # Security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # Content Security Policy
        csp = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com; "
            "img-src 'self' data: https:; "
            "connect-src 'self' https://api.openai.com https://api.stripe.com; "
        )
        response.headers["Content-Security-Policy"] = csp

        # Remove server header
        if "server" in response.headers:
            del response.headers["server"]

        return response


# Token bucket implementation for more sophisticated rate limiting
class TokenBucket:
    """
    Token bucket algorithm for rate limiting
    """

    def __init__(self, capacity: int, refill_rate: float):
        """
        capacity: Maximum number of tokens
        refill_rate: Tokens added per second
        """
        self.capacity = capacity
        self.refill_rate = refill_rate
        self.tokens = capacity
        self.last_refill = time.time()

    def consume(self, tokens: int = 1) -> bool:
        """
        Try to consume tokens. Returns True if successful.
        """
        # Refill tokens based on time passed
        now = time.time()
        time_passed = now - self.last_refill
        self.tokens = min(
            self.capacity,
            self.tokens + time_passed * self.refill_rate
        )
        self.last_refill = now

        # Try to consume
        if self.tokens >= tokens:
            self.tokens -= tokens
            return True
        return False


# IP whitelist/blacklist
class IPFilter:
    """
    Filter requests based on IP whitelist/blacklist
    """

    def __init__(self, whitelist: Optional[list] = None, blacklist: Optional[list] = None):
        self.whitelist = set(whitelist or [])
        self.blacklist = set(blacklist or [])

    def is_allowed(self, ip: str) -> bool:
        """
        Check if IP is allowed
        """
        # If whitelist exists, only allow whitelisted IPs
        if self.whitelist:
            return ip in self.whitelist

        # Otherwise, check blacklist
        return ip not in self.blacklist


def validate_api_key(api_key: str) -> bool:
    """
    Validate API key for external integrations
    This is a placeholder - implement your own logic
    """
    # In production, validate against database
    return len(api_key) >= 32


def sanitize_input(text: str, max_length: int = 10000) -> str:
    """
    Sanitize user input to prevent XSS and injection attacks
    """
    # Remove null bytes
    text = text.replace('\x00', '')

    # Truncate to max length
    if len(text) > max_length:
        text = text[:max_length]

    # Remove potentially dangerous characters
    dangerous_chars = ['<', '>', '"', "'", '&', ';']
    for char in dangerous_chars:
        text = text.replace(char, '')

    return text.strip()


def is_safe_redirect_url(url: str, allowed_hosts: list) -> bool:
    """
    Check if redirect URL is safe (prevent open redirect vulnerabilities)
    """
    from urllib.parse import urlparse

    if not url:
        return False

    parsed = urlparse(url)

    # Relative URLs are safe
    if not parsed.netloc:
        return True

    # Check if host is in allowed list
    return parsed.netloc in allowed_hosts
