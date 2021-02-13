from rest_framework.exceptions import APIException


class GeneralException(APIException):
    status_code = 400
    default_detail = 'API error'
    default_code = 'general_exception'

    def __init__(self, detail=None, code=None):
        super().__init__(detail=detail, code=code)
