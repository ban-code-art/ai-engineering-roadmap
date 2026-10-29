# Component fixture: a second version with an isolated change.
def build_payload(label: str) -> dict[str, str]:
    return {"label": label.upper()}
