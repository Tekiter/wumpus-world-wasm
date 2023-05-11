import bridge
import agent

if __name__ == "__main__":
    world = bridge.getWorld()
    next_action = agent.reasoning(world)
    bridge.sendAction(next_action)

