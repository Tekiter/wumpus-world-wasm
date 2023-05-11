import bridge
import agent

if __name__ == "__main__":
    memory = bridge.getMemory()
    if not memory:
        memory = {}
        agent.initialize(memory)
    next_action = agent.reasoning(memory)
    bridge.setMemory(memory)
    bridge.sendAction(next_action)

