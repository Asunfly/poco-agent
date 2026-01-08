from typing import Any

from claude_agent_sdk import AssistantMessage, ToolUseBlock

from app.hooks.base import AgentHook, ExecutionContext
from app.schemas.state import TodoItem


class TodoHook(AgentHook):
    async def on_agent_response(self, context: ExecutionContext, message: Any):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if isinstance(block, ToolUseBlock) and block.name == "TodoWrite":
                    raw_todos = block.input.get("todos", [])
                    context.current_state.todos = [TodoItem(**t) for t in raw_todos]
