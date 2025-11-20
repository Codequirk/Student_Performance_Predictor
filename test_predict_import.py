import sys
sys.path.insert(0, r'c:\Users\pragn.LAPTOP-DAHFBVDA\OneDrive\Documents\student2.0\backend')

try:
    from routes.predict import router
    print('✓ Predict router imported successfully')
    print(f'✓ Routes registered: {[route.path for route in router.routes]}')
except Exception as e:
    print(f'✗ Error importing predict route: {e}')
    import traceback
    traceback.print_exc()
