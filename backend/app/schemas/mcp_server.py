from datetime import datetime

from pydantic import BaseModel


class McpServerCreateRequest(BaseModel):
    name: str
    server_config: dict
    display_name: str | None = None
    scope: str | None = None


class McpServerUpdateRequest(BaseModel):
    name: str | None = None
    server_config: dict | None = None
    display_name: str | None = None
    scope: str | None = None


class McpServerResponse(BaseModel):
    id: int
    name: str
    server_config: dict
    display_name: str | None
    scope: str
    owner_user_id: str | None
    created_at: datetime
    updated_at: datetime
