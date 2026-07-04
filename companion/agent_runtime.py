# agent_runtime.py — run real RAPP agent .py files in Pyodide, browser-persisted.
# Provides `agents.basic_agent` (BasicAgent) and `utils.azure_file_storage` (AzureFileStorageManager,
# backed by the browser's localStorage) as importable modules, so UNMODIFIED agent files run in the tab.
# Same shape as brainstem.py: each agent = a BasicAgent subclass with name/metadata/perform()/to_tool()/system_context().
import sys, types, json, traceback

# Storage lives in this in-cell dict. The sandboxed (opaque-origin) Pyodide cell CANNOT touch the page's
# localStorage, so the host seeds this from localStorage before an agent runs and dumps it back after.
_MEM = {}
def _get(k): return _MEM.get(k)
def _set(k, v): _MEM[k] = v
def _del(k): _MEM.pop(k, None)
def seed_store(json_str):
    try:
        d = json.loads(json_str)
        if isinstance(d, dict): _MEM.update(d)
        return {"seeded": len(_MEM)}
    except Exception as e:
        return {"error": str(e)}
def dump_store():
    return dict(_MEM)

# --- drop-in for AzureFileStorageManager, persisting to localStorage (shared key space with vBrainstem) ---
class AzureFileStorageManager:
    def __init__(self, share_name=None, **kwargs):
        self.shared_memory_path = "shared_memories"
        self.default_file_name = "memory.json"
        self.current_memory_path = self.shared_memory_path
        self.current_guid = None
    def set_memory_context(self, user_guid=None):
        g = str(user_guid).strip() if user_guid is not None else ""
        if g and g.lower() not in ("none", "null"):
            self.current_guid = g; self.current_memory_path = "memory/" + g
        else:
            self.current_guid = None; self.current_memory_path = self.shared_memory_path
    def _fp(self, file_path=None):
        if file_path: return "vb_fs:" + str(file_path)
        if self.current_guid: return "vb_fs:" + self.current_memory_path + "/user_memory.json"
        return "vb_fs:" + self.shared_memory_path + "/" + self.default_file_name
    def read_json(self, file_path=None):
        v = _get(self._fp(file_path))
        if not v: return {}
        try: return json.loads(v)
        except Exception: return {}
    def write_json(self, data, file_path=None):
        _set(self._fp(file_path), json.dumps(data, default=str))
    def read_file(self, file_path):
        return _get("vb_fs:" + str(file_path)) or ""
    def write_file(self, file_path, content):
        _set("vb_fs:" + str(file_path), content)
    def file_exists(self, file_path):
        return _get("vb_fs:" + str(file_path)) is not None
    def delete_file(self, file_path):
        _del("vb_fs:" + str(file_path))
    def list_files(self, directory=""):
        return []

# register module shims so agent imports resolve
_utils = types.ModuleType("utils"); sys.modules["utils"] = _utils
_az = types.ModuleType("utils.azure_file_storage"); _az.AzureFileStorageManager = AzureFileStorageManager
sys.modules["utils.azure_file_storage"] = _az; _utils.azure_file_storage = _az
_azflat = types.ModuleType("azure_file_storage"); _azflat.AzureFileStorageManager = AzureFileStorageManager
sys.modules["azure_file_storage"] = _azflat
_agents_pkg = types.ModuleType("agents"); sys.modules["agents"] = _agents_pkg

AGENTS = {}

def register_basic(source):
    """Load basic_agent.py, define BasicAgent, and register the agents.basic_agent module."""
    ns = {}
    exec(compile(source, "basic_agent.py", "exec"), ns)
    Base = ns.get("BasicAgent")
    m = types.ModuleType("agents.basic_agent"); m.BasicAgent = Base
    sys.modules["agents.basic_agent"] = m; _agents_pkg.basic_agent = m
    globals()["BasicAgent"] = Base
    return {"ok": bool(Base)}

def load_agent(source, filename="agent.py"):
    """Exec an agent .py source, find the BasicAgent subclass, instantiate + register it."""
    try:
        ns = {}
        exec(compile(source, filename, "exec"), ns)
        Base = globals().get("BasicAgent")
        inst = None
        for v in ns.values():
            if isinstance(v, type) and Base is not None and issubclass(v, Base) and v is not Base:
                inst = v(); break
        if inst is None:
            return {"error": "no BasicAgent subclass found in " + filename}
        AGENTS[inst.name] = inst
        return {"loaded": inst.name, "tool": inst.to_tool()}
    except Exception as e:
        return {"error": str(e), "trace": traceback.format_exc()[-600:]}

def tools():
    out = []
    for a in AGENTS.values():
        try: out.append(a.to_tool())
        except Exception: pass
    return out

def contexts():
    out = []
    for a in AGENTS.values():
        try:
            c = a.system_context()
            if c: out.append(c)
        except Exception: pass
    return out

def run_agent(name, args_json="{}"):
    a = AGENTS.get(name)
    if a is None: return {"error": "no agent: " + name}
    try:
        args = json.loads(args_json) if isinstance(args_json, str) else (args_json or {})
        return {"agent": name, "output": a.perform(**args)}
    except Exception as e:
        return {"agent": name, "error": str(e), "trace": traceback.format_exc()[-600:]}

def agent_names():
    return list(AGENTS.keys())
