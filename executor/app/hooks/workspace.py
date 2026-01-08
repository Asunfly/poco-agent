from typing import Any

from app.hooks.base import AgentHook, ExecutionContext


class WorkspaceHook(AgentHook):
    async def on_agent_response(self, context: ExecutionContext, message: Any):
        pass
