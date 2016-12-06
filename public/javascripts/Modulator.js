////////////////////////////////////////////////////////////
/// モジュレータ
/// 変調に用いる音色（通常は声）を生成・管理する
////////////////////////////////////////////////////////////
VOCODER.Modulator = function(onReady) {
    var me = this;

    this.src          = VOCODER.audioCtx.createBufferSource();
    this.analyserNode = VOCODER.audioCtx.createAnalyser();
    this.dst          = VOCODER.audioCtx.destination;

    // Analyserノードの内部データ（周波数スペクトル）
    this.spectrumData = new Float32Array(this.analyserNode.frequencyBinCount);

    ////////////////////////////////////////////////////////////
    /// AudioBufferを用いてオーディオグラフを初期化する
    ////////////////////////////////////////////////////////////
    var InitByAudioBuffer = function(audioBuffer) {
        // 音源ノード
        me.src.buffer             = audioBuffer;
        me.src.loop               = false;
        me.src.loopStart          = 0;
        me.src.loopEnd            = audioBuffer.duration;
        me.src.playbackRate.value = 0.75;

        // ノードの接続
        // [src] -> [analyserNode] -> [(dst)]
        me.src.connect(me.analyserNode);
        //me.analyserNode.connect(me.dst);

        me.src.start();

        onReady();
    };

    this.GetOvertone = function() {
        this.analyserNode.getFloatFrequencyData(this.spectrumData);

        var maxDb       = this.analyserNode.maxDecibels;
        var minDb       = this.analyserNode.minDecibels;
        var sampleRate  = VOCODER.audioCtx.sampleRate;
        var fftSize     = this.analyserNode.fftSize;
        var octave      = 1;
        var baseFreq    = 0;
        var baseFreqDb  = minDb;
        var overtone    = [];

        this.spectrumData.forEach(function(db, idx) {
            var nowFreq  = (sampleRate * idx) / fftSize;

            if (nowFreq < 440 && baseFreqDb < db) {
                baseFreqDb = db;
                baseFreq   = nowFreq;
            }
        });

        this.spectrumData.forEach(function(db, idx) {
            //var db       = (byteData * ((maxDb - minDb) / 255)) + minDb;
            var gain     = Math.pow(10, db / 20);
            var prevFreq = (sampleRate * (idx - 1)) / fftSize;
            var nowFreq  = (sampleRate * idx)       / fftSize;

            if (prevFreq < (baseFreq * octave) && (baseFreq * octave) <= nowFreq) {
                // 倍音の時のみゲインを追加していく
                overtone.push(gain);

                octave++;
            }
        });

        return overtone;
    };

    ////////////////////////////////////////////////////////////
    /// 音声ファイル読み込み
    ////////////////////////////////////////////////////////////
    this.LoadSoundFile = function(soundFileName) {
        // 選択したファイルパスの表示
        VOCODER.fs.readFile(soundFileName, function(err, data) {
            if (err) {
                console.error(err);
            }

            // data（配列）をArrayBufferに変換
            var arrayBuffer = VOCODER.Util.ToArrayBuffer(data);

            // ArrayBuffer -> AudioBuffer への変換
            VOCODER.audioCtx.decodeAudioData(
                arrayBuffer,
                InitByAudioBuffer,      // On Success
                function(err) {         // On Error
                    console.error(err);
                }
            );
        });
    };
};
