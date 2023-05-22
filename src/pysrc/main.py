import traceback
import bridge
import agent


if __name__ == "__main__":
    memory = bridge.getMemory()

    try:
        if not memory:
            memory = {}
            agent.initialize(memory)
        lastDead = bridge.getLastDead()
        if lastDead:
            agent.dead(memory, lastDead)
        percept = bridge.getPercept()
        next_action = agent.reasoning(memory, percept)
        bridge.setMemory(memory)
        bridge.sendAction(next_action)
    except Exception as err:
        formatted = ''.join(traceback.format_exception(err))
        bridge.sendPythonError(formatted)
