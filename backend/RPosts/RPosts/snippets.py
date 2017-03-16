# -*- encoding: utf-8 -*-
import datetime
from time import mktime

def datetime_to_ms(dt):
    return 1000.0 * mktime(dt.timetuple())
