# 基于博弈树Negamax搜索、$\alpha-\beta$剪枝、启发式搜索的井字棋与五子棋AI



## 实验简介

​	自从AlphaGo、AlphaZero、AlphaZeroGo的问世，从蒙特卡洛树搜索到强化学习，棋类AI越来越厉害。本次实验使用了博弈树上的极大极小值搜索、Alpha-Beta剪枝和启发式搜索，实现了两个简单的棋类AI——井子棋和五子棋。



## 实验目的

 - 掌握极大极小值搜索算法
 - 掌握Negamax搜索算法
 - 掌握$\alpha-\beta$剪枝算法
 - 掌握启发式搜索算法
 - 熟悉使用React.js与Electron发布跨平台应用



## 实验相关原理与技术

### 算法

1. 极大极小值搜索算法 Minimax search

   ​	极大极小值算法是双人博弈中的常用算法，主要思想是一方要在可选的选项中选择将其优势最大化的选择，另一方则选择令对手优势最小化的方法。具体是实现是对博弈树进行深度优先搜索，评估遍历到的节点的分数，在搜索过程中使自己的分数和对手分数之差最大化，以到达寻找形成**对自己最优、对对手最劣**的走法。

   ​	下面用井字棋的博弈树详细说明。井子棋的搜索树如下图所示。假设人类玩家先手，AI后手，空棋盘是第0层，那么博弈树的偶数层代表人类棋手的落子，奇数层代表AI的落子，搜索的时候，在走到叶子结点时，使**奇数层局面评估与偶数层局面评估之差**最大。

   ![640px-Tic-tac-toe-game-tree.svg](./img/640px-Tic-tac-toe-game-tree.svg.png)

   ​	考虑井字棋的最大状态数不超过$9!=362880$，搜索**深度可以不限定**，直到输/赢/平局位置停止，因此评估函数可以设置为

   $$evaluation(chessboard)=\left\{ \begin{aligned} -1 & , & player \  wins \\ 0 & , & else \\ 1 & , & AI \ wins \end{aligned} \right. \tag{1}$$

   ​	具体代码如下。遍历棋盘找空位，**假设在此处落子**，预测对方落子位置并**获得评估分数**，**回溯**。其中`ai_move`相当于*max*（最大化自己的评估分数）的过程，`player_move`相当于*min*（最小化对方的评估分数）的过程。

   ```js
   const ai_move = (chessboard) => {
       let ret = { score: -INF, best_move: [] }, temp_score;
   
       let win_state = is_about_to_win(chessboard, AI);
       if (win_state.flag === true)                  
           ret = { score: AI, best_move: win_state.best_move };
       else if (is_full(chessboard))
           ret.score = TIE;
       else {
           for (let i = 0; i < 3; i ++)
               for (let j = 0; j < 3; j ++)
                   if (chessboard[i][j] === 0) {
                       // place here
                       chessboard[i][j] = AI;    
                       // predict player move
                       temp_score = player_move(chessboard).score; 
                       // rollback
                       chessboard[i][j] = 0;                                        
   
                       // update score and best move
                       if (temp_score > ret.score) {          
                           ret.score = temp_score;
                           ret.best_move = [i, j];
                       }
                   }
       }
   
       return ret;
   };
   
   
   const player_move = (chessboard) => {                              
       let ret = { score: INF, best_move: [] }, temp_score;
   
       let win_state = is_about_to_win(chessboard, PLAYER);
       if (win_state.flag === true)
           ret = { score: PLAYER, best_move: win_state.best_move };
       else if (is_full(chessboard))     
           ret.score = TIE;
       else {
           for (let i = 0; i < 3; i ++)
               for (let j = 0; j < 3; j ++)
                   if (chessboard[i][j] === 0) {
                       // place here
                       chessboard[i][j] = PLAYER;            
                       // predict AI move
                       temp_score = ai_move(chessboard).score;   
                       // rollback
                       chessboard[i][j] = 0;                                        
   				  
                       // update score and best move
                       if (temp_score < ret.score) {                                
                           ret.score = temp_score;
                           ret.best_move = [i, j];
                       }
                   }
       }
   
       return ret;
   };
   ```

   

2. $\alpha-\beta$-剪枝算法 Alpha Beta Pruning

   考虑五子棋，博弈树就很大一棵了，暴搜是不现实的，所以必须剪枝。$\alpha-\beta$-剪枝的主要思想是**减少搜索树的分枝**，将搜索时间用在**分差更大**的子树上，继而提升搜索深度。具体实现为：$\alpha$代表已经评估过的己方局面的最大值， $\beta$ 代表已经评估过的对方局面最小值。

   ![AB_pruning.svg](./img/AB_pruning.svg.png)

   

   

   

3. 极大极小值算法的优化 Negamax

   

   

   

   

4. 启发式搜索算法













### 框架

1. React.js
2. Electron



## 实验环境

- 操作系统及硬件配置

![Screen Shot 2018-07-14 at 11.19.34](./img/Screen Shot 2018-07-14 at 11.19.34.png)

- 编程语言：遵守ES6的JavaScript
- UI界面搭建：html5 + css3 + React.js + Electron



## 实验方案与过程







## 实验总结