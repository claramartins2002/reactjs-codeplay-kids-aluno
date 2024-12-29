class AudioManager {
    constructor(audioSrc, options = {}) {
        this.audio = new Audio(audioSrc);
        this.audio.loop = options.loop || false;
        this.audio.volume = options.volume || 0.5;
        this.isPlaying = false;
        this.allowMultiplePlays = options.allowMultiplePlays || false;
    }

    play() {
        if (this.allowMultiplePlays || !this.isPlaying) {
            if (this.allowMultiplePlays) {
                this.audio.currentTime = 0;
            }
            
            this.audio.play().catch(error => {
                console.error('Erro ao reproduzir áudio:', error);
            });
            this.isPlaying = true;

            if (this.allowMultiplePlays) {
                this.audio.onended = () => {
                    this.isPlaying = false;
                };
            }
        }
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.isPlaying = false;
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
    }
}

export default AudioManager; 