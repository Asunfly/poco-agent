import logging


def configure_logging(*, debug: bool) -> None:
    """Configure application logging.

    Args:
        debug: If True, set logging level to DEBUG; otherwise INFO.
    """
    level = logging.DEBUG if debug else logging.INFO
    if not logging.getLogger().handlers:
        logging.basicConfig(
            level=level,
            format="%(asctime)s %(levelname)s %(name)s %(message)s",
        )
    else:
        logging.getLogger().setLevel(level)
