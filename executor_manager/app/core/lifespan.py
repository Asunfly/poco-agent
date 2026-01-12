import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.scheduler.scheduler_config import scheduler

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management for scheduler."""
    # Start scheduler
    logger.info("Starting APScheduler...")
    scheduler.start()
    logger.info("APScheduler started")
    yield
    # Shutdown scheduler
    logger.info("Shutting down APScheduler...")
    scheduler.shutdown()
    logger.info("APScheduler shut down")
