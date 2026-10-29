# Component fixture: an alternative complete version for the file viewer.
def build_payload(label: str) -> dict[str, str]:
    return {"label": label, "source": "component-preview"}
