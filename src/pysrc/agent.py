

def initialize(memory):
    memory['a'] = 1
    memory['arr'] = [1,2,3,4,5]
    memory['obj'] = {'a':1}
    

def reasoning(memory):
    memory["a"] += 1

    print(memory)

    return "gogo"
    
