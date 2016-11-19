////////////////////////////////////////////////////////////
/// モジュレータ
/// 変調に用いる音色（通常は声）を生成・管理する
////////////////////////////////////////////////////////////
VOCODER.Modulator = function() {
    var me = this;

    this.src          = VOCODER.audioCtx.createBufferSource();
    this.analyserNode = VOCODER.audioCtx.createAnalyser();
    this.dst          = VOCODER.audioCtx.destination;

    ////////////////////////////////////////////////////////////
    /// AudioBufferを用いてオーディオグラフを初期化する
    ////////////////////////////////////////////////////////////
    var InitByAudioBuffer = function(audioBuffer) {
        // 音源ノード
        me.src.buffer             = audioBuffer;
        me.src.loop               = false;
        me.src.loopStart          = 0;
        me.src.loopEnd            = audioBuffer.duration;
        me.src.playbackRate.value = 1.0;

        // ノードの接続
        // [src] -> [analyserNode] -> [(dst)]
        me.src.connect(me.analyserNode);
        me.analyserNode.connect(me.dst);

        me.src.start();
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
