import sys
import ssl
import http.client

# Monkeypatch HTTPResponse to rewrite HTTP/2 status lines to HTTP/1.1
original_begin = http.client.HTTPResponse.begin

def custom_begin(self, *args, **kwargs):
    if self.headers is None and hasattr(self.fp, "readline"):
        orig_readline = self.fp.readline
        def custom_readline(*rargs, **rkwargs):
            line = orig_readline(*rargs, **rkwargs)
            if line.startswith(b"HTTP/2.0 ") or line.startswith(b"HTTP/2 "):
                line = line.replace(b"HTTP/2.0 ", b"HTTP/1.1 ").replace(b"HTTP/2 ", b"HTTP/1.1 ")
            return line
        self.fp.readline = custom_readline
    return original_begin(self, *args, **kwargs)

http.client.HTTPResponse.begin = custom_begin



from pip._internal.cli.main import main
sys.exit(main(["install", "-r", "requirements.txt"]))
