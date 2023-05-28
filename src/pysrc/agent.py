from collections import deque
import copy
import sys
sys.setrecursionlimit(10 ** 6)
# 위,오,아래,왼
dx,dy = [0,1,0,-1],[1,0,-1,0]

def initialize(memory):
    memory['world']= [[[],[],[],[],[],[]],[[],[],[],[],[],[]],[[],[],[],[],[],[]],[[],[],[],[],[],[]],[[],[],[],[],[],[]],[[],[],[],[],[],[]]]
    for i in range(6):
        for j in range(6):
            memory['world'][i][j]={'wumpus':0,'pitch': 0,'bump':0,'null':0,'chk':0,'dead':0}
    memory['world'][1][1]['null'] = memory['world'][1][1]['chk'] = 1
    memory['player']={'loc':[1,1],'dir':1,'arrow':2,'gold':0}
    memory['decideStart']=0
    memory['dir']=[]
    memory['vis']=[[0]*(6) for _ in range(6)]
    memory['climb']=0
    memory['act'] = []
    memory['flag'] = 0

def dead(memory,reason):
    print("DEAD!",reason)
    x, y = memory['player']['loc']
    if reason == "wumpus":
        memory['world'][x][y]["wumpus"] = 1
    elif reason == "pitch":
        memory['world'][x][y]["pitch"] = 1
    memory['world'][x][y]['chk'] = 1
    memory['flag'] = 0
    memory['turn'] = 0
    memory['climb']= 0
    memory['act']=[]
    memory['vis'] = [[0] * (6) for _ in range(6)]
    memory['player'] = {'loc':[1,1],'dir':1,'arrow':2,'gold':0}


# 사용 가능한 액션
#[
#  "GoForward",
#  "TurnLeft",
#  "TurnRight",
#  "Grab",
#  "Shoot",
#  "Climb",
#  "None",
#  "NoExit"
#]

def reasoning(memory, percept):
    x, y = memory['player']['loc']
    memory['world'][x][y]['chk'] = 1
    dir = memory['player']['dir']
    gold = memory['player']['gold']
    if gold == 0 :
        memory['vis'][x][y]=1
    print(memory['player'])
    if gold==1:
        if memory['climb'] == 0:
            q = deque()
            q.append([4, 4, dir, []])
            memory['vis'][x][y]=2
            while q:
                X, Y, Dir, Act = q.popleft()
                if X == 1 and Y == 1:
                    memory['climb'] = 1
                    Act.append('Climb')
                    memory['act'] = Act
                    break
                for i in range(4):
                    nx = X + dx[(Dir + i) % 4]
                    ny = Y + dy[(Dir + i) % 4]
                    if nx >= 5 or nx < 1 or ny >= 5 or ny < 1: continue
                    if memory['world'][nx][ny]['pitch'] == 1:
                        memory['vis'][nx][ny]=2
                        continue
                    if memory['vis'][nx][ny] == 1 and memory['world'][nx][ny]['bump'] == 0 and memory['world'][nx][ny]['pitch'] == 0:
                        memory['vis'][nx][ny] = 2
                        tmp = copy.deepcopy(Act)
                        if i == 3:
                            tmp.append("TurnLeft")
                        else:
                            for _ in range(i): tmp.append("TurnRight")
                        tmp.append("GoForward")
                        q.append([nx, ny, (Dir + i) % 4, tmp])
        print(memory['act'])
        move = memory['act'].pop(0)
        return move
    if memory['flag']==0:
        # bfs
        vis = [[0] * (6) for _ in range(6)]
        q = deque() # x,y,dir,used arrow,all act
        q.append([x, y, dir, 2-memory['player']['arrow'], []])
        vis[x][y] = 1
        while q:
            X, Y, Dir,Arrow, Act = q.popleft()
            if memory['decideStart'] == 1:
                memory['flag'] = 1
                break
            for i in range(4):
                nx = X + dx[(Dir + i) % 4]
                ny = Y + dy[(Dir + i) % 4]
                if memory['world'][nx][ny]['chk'] == 0:
                    memory['decideStart'] = 1
                    if i == 3:
                        Act.append("TurnLeft")
                    else:
                        for _ in range(i): Act.append("TurnRight")
                    memory['dir'] = Act + ["GoForward"]
                    memory['flag'] =1
                    break;
                elif memory['world'][nx][ny]['null'] == 1:
                    if vis[nx][ny] == 0:
                        vis[nx][ny] = 1
                        tmp = copy.deepcopy(Act)
                        if i==3:
                            tmp.append("TurnLeft")
                        else:
                            for _ in range(i): tmp.append("TurnRight")
                        tmp.append("GoForward")
                        q.append([nx, ny, (Dir+i)%4,Arrow, tmp])
                elif memory['world'][nx][ny]['wumpus'] == 1:
                    if memory['vis'][nx][ny] == 1 and vis[nx][ny]==0:
                        tmp = copy.deepcopy(Act)
                        if i == 3:
                            tmp.append("TurnLeft")
                        else:
                            for _ in range(i): tmp.append("TurnRight")
                        tmp.append("GoForward")
                        q.append([nx, ny, (Dir + i) % 4, Arrow, tmp])
                    elif Arrow<2 and vis[nx][ny]==0:
                        tmp = copy.deepcopy(Act)
                        if i==3:
                            tmp.append("TurnLeft")
                        else:
                            for _ in range(i): tmp.append("TurnRight")
                        tmp.append("Shoot"),tmp.append("GoForward")
                        q.append([nx,ny,(Dir+i)%4,Arrow+1,tmp])
                    vis[nx][ny]=1
                elif memory['world'][nx][ny]['pitch'] == 1:
                    vis[nx][ny] = 1
        if memory['decideStart'] ==0:
            return "NoExit"
        memory['decideStart'] = 0
    if memory['dir']:
        move = memory['dir'].pop(0)
        if move == "GoForward":
            nx = x + dx[dir]
            ny = y + dy[dir]
            memory['player']['loc'] = [nx, ny]
            return "GoForward"
        elif move == "TurnRight":
            memory['player']['dir'] = (dir + 1) % 4
            return "TurnRight"
        elif move == "TurnLeft":
            memory['player']['dir'] = (dir + 3) % 4
            return "TurnLeft"
        elif move == "Shoot":
            memory['player']['arrow'] =memory['player']['arrow'] - 1
            return "Shoot"
    else:
        if percept['glitter'] == True:
            memory['player']['gold'] = 1
            return 'Grab'
        elif percept['bump'] == True:
            memory['world'][x][y]['bump'] = 1
            memory['player']['loc'] = [x - dx[dir], y - dy[dir]]
            memory['player']['dir'] = (dir + 1) % 4
            return "TurnRight"
        else:
            if memory['world'][x][y]['wumpus'] != 1 and memory['world'][x][y]['pitch'] != 1 :
                memory['world'][x][y]['null'] = 1
            nx = x + dx[dir]
            ny = y + dy[dir]
            cnt = 0
            # 4방향이 모두 탐색이 완료된 상황이면 시작점 재 탐색
            for i in range(4):
                nextX = x +dx[(dir+i)%4]
                nextY = y +dy[(dir+i)%4]
                if memory['world'][nextX][nextY]['chk'] == 1: cnt+=1
            if cnt == 4:
                memory['flag'] = 0
                memory['player']['dir']=(dir+1)%4
                return "TurnRight"
            elif memory['world'][nx][ny]['chk'] == 1 :
                memory['player']['dir']=(dir+1)%4
                return "TurnRight"
            else :
                memory['player']['loc'] = [x + dx[dir], y + dy[dir]]
                return "GoForward"
