export class MarcacaoSono {
    isAtiva: boolean;
    ultimaMarcacao: Date | null;

    constructor(isAtiva: boolean, ultimaMarcacao: Date | null) {
        this.isAtiva = isAtiva;
        this.ultimaMarcacao = ultimaMarcacao;
    }

    iniciar(){
        this.isAtiva = true;
        this.ultimaMarcacao = new Date(Date.now());
    }

    parar() {
        this.isAtiva = false;
    }

    reiniciar() {
        this.isAtiva = false;
        this.ultimaMarcacao = null;
    }
}