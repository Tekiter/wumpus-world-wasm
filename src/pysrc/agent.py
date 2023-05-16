

def initialize(memory):
    memory['actions'] = ["GoForward", "TurnLeft", "GoForward", "TurnLeft", "GoForward", "TurnLeft"]
    memory['idx'] = 0
    
def dead(memory):
    print("DEAD!")

def reasoning(memory, percept):
    idx = memory['idx']
    next_action = memory['actions'][idx]

    memory['idx'] = (idx + 1) % len(memory['actions'])
    
    return next_action
    
