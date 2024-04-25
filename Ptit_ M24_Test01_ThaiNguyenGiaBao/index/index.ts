interface IPlayer {
    id: number;
    name: string;
    score: number;
}

class Player implements IPlayer {
    constructor(public id: number, public name: string, public score: number) {}
}

class PlayerManager {
    private players: Player[];
    constructor() {
        let playersData = localStorage.getItem('players');
        this.players = playersData ? JSON.parse(playersData) : [];
    }
    renderPlayer(): void {
        let tbody = document.querySelector('tbody');
        let resuPoin = document.getElementById('resuPoin');
        let resuPlayer = document.getElementById('resuPlayer'); // Thêm đoạn này
        if (!tbody || !resuPoin || !resuPlayer) return;
        tbody.innerHTML = ''; 
        let totalScore = 0; 
        let totalPlayers = this.players.length; // Tổng số người chơi
        this.players.forEach(player => {
            totalScore += player.score;
            let row = document.createElement('tr');
            row.innerHTML = `
                <td><button class="dltPlayer" data-id="${player.id}">Delete</button></td>
                <td class="playerName"><i class="fa-solid fa-crown"></i><p>${player.name}</p></td>
                <td><p class="quantity"><button class="reduce" data-id="${player.id}">-</button>${player.score}<button class="increasing" data-id="${player.id}">+</button></p></td>
            `;
            tbody.appendChild(row);
        });
        resuPoin.innerText = `${totalScore}`;
        resuPlayer.innerText = `${totalPlayers}`; 
        this.addDeleteEventListeners(); 
        this.addQuantityEventListeners();
    }
    createPlayer(name: string): void {
        let id = this.players.length + 1;
        let newPlayer = new Player(id, name, 0);
        this.players.push(newPlayer);
        this.saveToLocalStorage();
        this.renderPlayer();
    }
    private saveToLocalStorage(): void {
        localStorage.setItem('players', JSON.stringify(this.players));
    }
    private addDeleteEventListeners(): void {
        let deleteButtons = document.querySelectorAll('.dltPlayer');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                let playerId = parseInt((event.target as HTMLButtonElement).getAttribute('data-id') || '');
                if (!isNaN(playerId)) {
                    this.deletePlayer(playerId);
                }
            });
        });
    }
    private deletePlayer(id: number): void {
        this.players = this.players.filter(player => player.id !== id);
        this.saveToLocalStorage();
        this.renderPlayer();
    }
    private addQuantityEventListeners(): void {
        let reduceButtons = document.querySelectorAll('.reduce');
        reduceButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                let playerId = parseInt((event.target as HTMLButtonElement).getAttribute('data-id') || '');
                if (!isNaN(playerId)) {
                    this.reduceQuantity(playerId);
                }
            });
        });

        let increasingButtons = document.querySelectorAll('.increasing');
        increasingButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                let playerId = parseInt((event.target as HTMLButtonElement).getAttribute('data-id') || '');
                if (!isNaN(playerId)) {
                    this.increaseQuantity(playerId);
                }
            });
        });
    }
    private reduceQuantity(id: number): void {
        let player = this.players.find(player => player.id === id);
        if (player && player.score > 0) {
            player.score--;
            this.saveToLocalStorage();
            this.renderPlayer();
        }
    }
    private increaseQuantity(id: number): void {
        let player = this.players.find(player => player.id === id);
        if (player) {
            player.score++;
            this.saveToLocalStorage();
            this.renderPlayer();
        }
    }
}

let playerManager = new PlayerManager();

playerManager.renderPlayer();

let addButton = document.getElementById('btAdd');
if (addButton) {
    addButton.addEventListener('click', () => {
        let inputElement = document.getElementById('add') as HTMLInputElement;
        if (inputElement.value.trim() !== '') {
            playerManager.createPlayer(inputElement.value.trim());
            inputElement.value = ''; 
        }
    });
}

document.addEventListener('DOMContentLoaded', () => { 
    playerManager.renderPlayer();
    let addButton = document.getElementById('btAdd');
    if (addButton) {
        addButton.addEventListener('click', () => {
            let inputElement = document.getElementById('add') as HTMLInputElement;
            if (inputElement.value.trim() !== '') {
                playerManager.createPlayer(inputElement.value.trim());
                inputElement.value = '';
            }
        });
    }
});
