from fastapi import FastAPI
from contextlib import asynccontextmanager
from .routers import courses, competitions, hackathons, internships
from .scheduler.tasks import start_scheduler

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    start_scheduler()
    yield
    # Shutdown
    # Add shutdown logic if needed

app = FastAPI(title="Student Opportunities API", description="API for scraping and serving student opportunities like courses and hackathons", lifespan=lifespan)

app.include_router(courses, prefix="/api/v1", tags=["courses"])
app.include_router(competitions, prefix="/api/v1", tags=["competitions"])
app.include_router(hackathons, prefix="/api/v1", tags=["hackathons"])
app.include_router(internships, prefix="/api/v1", tags=["internships"])
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)