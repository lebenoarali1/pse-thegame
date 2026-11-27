"""Lance tous les scénarios : python3 tests/run_all.py [nom]"""
import asyncio, glob, importlib.util, os, sys, time, traceback
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
names = sys.argv[1:]
files = sorted(glob.glob(os.path.join(HERE, 'scenarios', '*.py')))
ok = True
for f in files:
    n = os.path.basename(f)[:-3]
    if names and not any(x in n for x in names): continue
    spec = importlib.util.spec_from_file_location(n, f); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    t0 = time.time()
    try:
        asyncio.run(m.main()); print(f'PASS {n} ({time.time()-t0:.0f}s)  {m.__doc__.strip().splitlines()[0] if m.__doc__ else ""}')
    except Exception as e:
        ok = False; print(f'FAIL {n}: {e}'); traceback.print_exc(limit=2)
sys.exit(0 if ok else 1)
