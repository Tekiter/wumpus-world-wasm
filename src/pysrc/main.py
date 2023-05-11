import bridge
import agent

if __name__ == "__main__":
    memory = bridge.getMemory()
    if not memory:
        memory = {}
        agent.initialize(memory)
    if bridge.isLastDead():
        agent.dead(memory)
    percept = bridge.getPercept()
    next_action = agent.reasoning(memory, percept)
    bridge.setMemory(memory)
    bridge.sendAction(next_action)

