from django.http import HttpResponse
from .schema import schema

def activate(request, token):
    mutation = """
    mutation VerifyAccount($token: String!){
            verifyAccount(token: $token) {
            success,
            errors
        }
    }
    """
    result = schema.execute(mutation, variables= { 'token': token })

    return HttpResponse(result, content_type="application/json")