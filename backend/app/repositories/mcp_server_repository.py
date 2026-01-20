from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.mcp_server import McpServer


class McpServerRepository:
    @staticmethod
    def create(session_db: Session, server: McpServer) -> McpServer:
        session_db.add(server)
        return server

    @staticmethod
    def get_by_id(session_db: Session, server_id: int) -> McpServer | None:
        return session_db.query(McpServer).filter(McpServer.id == server_id).first()

    @staticmethod
    def get_by_name(session_db: Session, name: str) -> McpServer | None:
        return session_db.query(McpServer).filter(McpServer.name == name).first()

    @staticmethod
    def list_visible(session_db: Session, user_id: str) -> list[McpServer]:
        query = session_db.query(McpServer).filter(
            or_(McpServer.scope == "system", McpServer.owner_user_id == user_id)
        )
        return query.order_by(McpServer.created_at.desc()).all()

    @staticmethod
    def delete(session_db: Session, server: McpServer) -> None:
        session_db.delete(server)
