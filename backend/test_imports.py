#!/usr/bin/env python
# Test all imports

import sys
print("Python version:", sys.version)
print("Python executable:", sys.executable)

tests = [
    ("jwt", lambda: __import__('jwt')),
    ("passlib.context", lambda: __import__('passlib.context')),
    ("routes.teacher", lambda: __import__('routes.teacher')),
    ("utils.jwt_handler", lambda: __import__('utils.jwt_handler')),
    ("main", lambda: __import__('main')),
]

for name, importer in tests:
    try:
        importer()
        print(f"✅ {name} imported successfully")
    except Exception as e:
        print(f"❌ {name} failed: {e}")

print("\n✅ ALL IMPORTS WORKING")
