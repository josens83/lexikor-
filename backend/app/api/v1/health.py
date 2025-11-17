"""
Health Check and Monitoring Endpoints

Essential for production monitoring, uptime checks, and load balancers
Similar to what Stripe, GitHub, AWS provide
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from datetime import datetime
import psutil
import os

from app.core.database import get_db
from app.core.redis_client import redis_client

router = APIRouter()


@router.get("/health")
async def health_check():
    """
    Basic health check endpoint

    Returns HTTP 200 if service is running
    Used by: Load balancers, uptime monitors, health checkers
    """
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "LexiKor API",
        "version": "1.0.0"
    }


@router.get("/health/detailed")
async def detailed_health_check(db: AsyncSession = Depends(get_db)):
    """
    Detailed health check with dependency status

    Checks:
    - Database connectivity
    - Redis connectivity
    - System resources

    Returns 503 if any critical dependency is down
    """
    health_status = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "checks": {}
    }

    all_healthy = True

    # Check Database
    try:
        result = await db.execute(text("SELECT 1"))
        await result.fetchone()
        health_status["checks"]["database"] = {
            "status": "healthy",
            "message": "PostgreSQL connection successful"
        }
    except Exception as e:
        all_healthy = False
        health_status["checks"]["database"] = {
            "status": "unhealthy",
            "message": f"Database error: {str(e)}"
        }

    # Check Redis
    try:
        await redis_client.ping()
        health_status["checks"]["redis"] = {
            "status": "healthy",
            "message": "Redis connection successful"
        }
    except Exception as e:
        all_healthy = False
        health_status["checks"]["redis"] = {
            "status": "unhealthy",
            "message": f"Redis error: {str(e)}"
        }

    # Check System Resources
    try:
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')

        health_status["checks"]["system"] = {
            "status": "healthy" if cpu_percent < 90 and memory.percent < 90 else "warning",
            "cpu_percent": cpu_percent,
            "memory_percent": memory.percent,
            "disk_percent": disk.percent
        }

        if cpu_percent > 90 or memory.percent > 90:
            all_healthy = False

    except Exception as e:
        health_status["checks"]["system"] = {
            "status": "unknown",
            "message": f"System check error: {str(e)}"
        }

    # Overall status
    if not all_healthy:
        health_status["status"] = "unhealthy"
        raise HTTPException(status_code=503, detail=health_status)

    return health_status


@router.get("/health/ready")
async def readiness_check(db: AsyncSession = Depends(get_db)):
    """
    Kubernetes readiness probe

    Checks if the service is ready to accept traffic
    Returns 200 if ready, 503 if not
    """
    try:
        # Check database connectivity
        result = await db.execute(text("SELECT 1"))
        await result.fetchone()

        # Check Redis
        await redis_client.ping()

        return {
            "status": "ready",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail={
                "status": "not_ready",
                "timestamp": datetime.utcnow().isoformat(),
                "error": str(e)
            }
        )


@router.get("/health/live")
async def liveness_check():
    """
    Kubernetes liveness probe

    Checks if the application is alive
    Should return quickly without heavy checks
    """
    return {
        "status": "alive",
        "timestamp": datetime.utcnow().isoformat(),
        "uptime_seconds": int((datetime.utcnow() - datetime.fromtimestamp(psutil.Process(os.getpid()).create_time())).total_seconds())
    }


@router.get("/metrics")
async def metrics():
    """
    Prometheus-compatible metrics endpoint

    Returns basic application metrics for monitoring
    """
    try:
        process = psutil.Process(os.getpid())

        metrics_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "process": {
                "cpu_percent": process.cpu_percent(interval=0.1),
                "memory_mb": process.memory_info().rss / 1024 / 1024,
                "threads": process.num_threads(),
                "open_files": len(process.open_files()),
                "connections": len(process.connections())
            },
            "system": {
                "cpu_count": psutil.cpu_count(),
                "cpu_percent": psutil.cpu_percent(interval=1),
                "memory_total_gb": psutil.virtual_memory().total / 1024 / 1024 / 1024,
                "memory_available_gb": psutil.virtual_memory().available / 1024 / 1024 / 1024,
                "memory_percent": psutil.virtual_memory().percent,
                "disk_total_gb": psutil.disk_usage('/').total / 1024 / 1024 / 1024,
                "disk_used_gb": psutil.disk_usage('/').used / 1024 / 1024 / 1024,
                "disk_percent": psutil.disk_usage('/').percent
            }
        }

        return metrics_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Metrics error: {str(e)}")


@router.get("/status")
async def service_status(db: AsyncSession = Depends(get_db)):
    """
    Comprehensive service status page

    Returns detailed information about the service and its dependencies
    Useful for status pages and monitoring dashboards
    """
    status_info = {
        "service": {
            "name": "LexiKor API",
            "version": "1.0.0",
            "environment": os.getenv("ENVIRONMENT", "development"),
            "timestamp": datetime.utcnow().isoformat()
        },
        "dependencies": {}
    }

    # Database status
    try:
        start_time = datetime.utcnow()
        result = await db.execute(text("SELECT version()"))
        version = await result.fetchone()
        elapsed = (datetime.utcnow() - start_time).total_seconds() * 1000

        status_info["dependencies"]["database"] = {
            "status": "operational",
            "type": "PostgreSQL",
            "version": version[0] if version else "unknown",
            "response_time_ms": round(elapsed, 2)
        }
    except Exception as e:
        status_info["dependencies"]["database"] = {
            "status": "down",
            "error": str(e)
        }

    # Redis status
    try:
        start_time = datetime.utcnow()
        await redis_client.ping()
        elapsed = (datetime.utcnow() - start_time).total_seconds() * 1000

        info = await redis_client.info()
        status_info["dependencies"]["redis"] = {
            "status": "operational",
            "version": info.get("redis_version", "unknown"),
            "response_time_ms": round(elapsed, 2),
            "used_memory_mb": round(info.get("used_memory", 0) / 1024 / 1024, 2)
        }
    except Exception as e:
        status_info["dependencies"]["redis"] = {
            "status": "down",
            "error": str(e)
        }

    # System info
    status_info["system"] = {
        "hostname": os.uname().nodename,
        "platform": os.uname().sysname,
        "python_version": os.sys.version.split()[0],
        "cpu_count": psutil.cpu_count(),
        "memory_total_gb": round(psutil.virtual_memory().total / 1024 / 1024 / 1024, 2),
        "uptime_seconds": int((datetime.utcnow() - datetime.fromtimestamp(psutil.boot_time())).total_seconds())
    }

    return status_info
