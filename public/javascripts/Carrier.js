////////////////////////////////////////////////////////////
/// キャリア
/// 変調対象の音色（通常は何らかの楽器音）を生成・管理する
////////////////////////////////////////////////////////////
VOCODER.Carrier = function() {
    var me = this;

    // 音源ノード
    // （ここではカスタム波形オシレーターを用いている）
    this.oscillator = VOCODER.audioCtx.createOscillator();

    // オシレーター波形の初期設定
    (function() {
        var real = new Float32Array(32);
        var imag = new Float32Array(32);

        for (var i = 0; i < 32; i++) {
            real[i] = 0.0;
            imag[i] = 0.0;
        }

        var waveTable = VOCODER.audioCtx.createPeriodicWave(real, imag);

        me.oscillator.setPeriodicWave(waveTable);
        me.oscillator.frequency.value = 100;
    }());

    // ノードの接続（出力用）
    this.oscillator.connect(VOCODER.audioCtx.destination);

    // 音源の再生開始（この後常に再生だが、初期状態では無音）
    this.oscillator.start();

    // 合成波形を更新する
    this.reloadWave = function (data) {
        var real = new Float32Array(data.length + 1);
        var imag = new Float32Array(data.length + 1);

        var isMute = true;

        real[0] = 0.0;
        imag[0] = 0.0;

        for (var i = 0; i < 10; i++) {
            real[i + 1] = 0.0;
            imag[i + 1] = data[i];

            //real[i + 1] = data[i];
            //imag[i + 1] = 0.0;

            if (data[i] > 0.01) {
                isMute = false;
            }
        }

        if (isMute) {
            console.warn('mute');
            for (i = 0; i < 10; i++) {
                real[i + 1] = 0.0;
                imag[i + 1] = 0.0;
            }
        }

        var waveTable = VOCODER.audioCtx.createPeriodicWave(real, imag);
        this.oscillator.setPeriodicWave(waveTable);

        //console.log('reloadWave(' + VOCODER.audioCtx.currentTime + ')');
    };
};
