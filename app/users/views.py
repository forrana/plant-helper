from django.http import HttpResponse
from django.template import loader
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
    template = loader.get_template('users/activate.html')
    context = { 'data': result.data }

    return HttpResponse(template.render(context, request))