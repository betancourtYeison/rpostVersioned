# -*- encoding: utf-8 -*-

def format_form_errors(form, separator=u', '):
    non_field_errors = separator.join(map(unicode, form.non_field_errors()))
    iterkeys = form.fields.iterkeys()
    errors_arr = []
    continue_while = True
    while continue_while:
        try:
            key = iterkeys.next()
            item_errors = form.errors.get(key)
            if item_errors:
                for item in item_errors:
                    errors_arr.append(u'- ' + item)
        except:
            continue_while = False

    return u'Han ocurrido los siguientes errores: \n' + non_field_errors + '\n' + separator.join(map(unicode, errors_arr)) + '\n'
