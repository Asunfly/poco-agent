from enum import Enum


class ErrorCode(Enum):
    BAD_REQUEST = (40000, "Bad request")
    UNAUTHORIZED = (40100, "Unauthorized")
    FORBIDDEN = (40300, "Forbidden")
    NOT_FOUND = (40400, "Resource not found")

    TASK_NOT_FOUND = (20001, "Task not found")
    TASK_DISPATCH_FAILED = (20002, "Failed to dispatch task to executor")
    TASK_SCHEDULING_FAILED = (20003, "Failed to schedule task")

    SESSION_NOT_FOUND = (21001, "Session not found")
    SESSION_CREATE_FAILED = (21002, "Failed to create session")
    SESSION_UPDATE_FAILED = (21003, "Failed to update session status")

    EXECUTOR_UNAVAILABLE = (30001, "Executor service unavailable")
    BACKEND_UNAVAILABLE = (30002, "Backend service unavailable")
    CALLBACK_FORWARD_FAILED = (30003, "Failed to forward callback to backend")

    INTERNAL_ERROR = (50000, "Internal server error")

    @property
    def code(self) -> int:
        return self.value[0]

    @property
    def message(self) -> str:
        return self.value[1]
