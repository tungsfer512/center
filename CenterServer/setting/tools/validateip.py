import ipaddress

def is_ipv4(string):
    try:
        if "/" in string:
            return False
        ipaddress.IPv4Network(string)
        return True
    except ValueError:
        return False
    