from fastapi import Response, APIRouter

router = APIRouter()

@router.api_route("/", methods=["HEAD"], tags=["Health"])
def head_health_check():
    return Response(status_code=200)