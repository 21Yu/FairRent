from fastapi import Response, APIRouter

router = APIRouter()

@router.get("/", tags=["Health"])
def read_root():
    return {"message": "Welcome to the FairRent API"}

@router.api_route("/health", methods=["HEAD"], tags=["Health"])
def head_health_check():
    return Response(status_code=200)