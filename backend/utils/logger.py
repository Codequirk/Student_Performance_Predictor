import logging
import os
from datetime import datetime

# Create logs directory if it doesn't exist
os.makedirs("logs", exist_ok=True)

# Configure logging
log_file = f"logs/predictions_{datetime.now().strftime('%Y%m%d')}.log"
logging.basicConfig(
    filename=log_file,
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

def log_prediction(record):
    """Log prediction record."""
    try:
        logger.info(f"Prediction: {record}")
    except Exception as e:
        logger.error(f"Error logging prediction: {e}")

def log_error(error_msg):
    """Log error message."""
    logger.error(error_msg)

def log_info(info_msg):
    """Log info message."""
    logger.info(info_msg)
