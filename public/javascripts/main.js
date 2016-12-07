$(function() {
    console.info('Start "Vocoder".');

    var ctx = $('canvas#input').get(0).getContext('2d');

    ctx.clearRect(0, 0, 400, 200);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.0)';
    ctx.fillRect(0, 0, 400, 200);
    ctx.rect(0, 0, 400, 200);
    ctx.strokeStyle = 'rgba(0, 0, 0, 1.0)';
    ctx.stroke();

    var reloadFunc = function() {
        // モジュレータ音色の倍音構成を取得する
        var overtone = Modulator.GetOvertone();

        // キャリア（出力）音色の周波数スペクトルを取得する
        Carrier.analyserNode.getFloatFrequencyData(Carrier.spectrumData);

        ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';
        ctx.fillRect(0, 0, 400, 200);
        ctx.rect(0, 0, 400, 200);
        ctx.strokeStyle = 'rgba(0, 0, 0, 1.0)';
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.lineWidth   = 1.0;
        Modulator.spectrumData.forEach(function(db, idx) {
            var gain        = Math.pow(10, db / 20);
            var sampleRate  = VOCODER.audioCtx.sampleRate;
            var fftSize     = Modulator.analyserNode.fftSize;
            var nowFreq     = (sampleRate * idx) / fftSize;

            ctx.beginPath();
            ctx.moveTo(nowFreq / 10, 200);
            ctx.lineTo(nowFreq / 10, -db);
            ctx.stroke();
        });

        Carrier.reloadWave(overtone);

        ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)';
        ctx.lineWidth   = 1.0;
        Carrier.spectrumData.forEach(function(db, idx) {
            var gain        = Math.pow(10, db / 20);
            var sampleRate  = VOCODER.audioCtx.sampleRate;
            var fftSize     = Carrier.analyserNode.fftSize;
            var nowFreq     = (sampleRate * idx) / fftSize;

            ctx.beginPath();
            ctx.moveTo(nowFreq / 10, 200);
            ctx.lineTo(nowFreq / 10, -db);
            ctx.stroke();
        });
    };

    var OnModulatorReady = function() {
        reloadFunc();
        window.requestAnimationFrame(OnModulatorReady);
    };

    var Modulator = new VOCODER.Modulator(OnModulatorReady);
    var Carrier   = new VOCODER.Carrier();

    $('h1').on('click', function() {
        // ファイル選択ダイアログを開き、音声ファイルを選択する
        var soundFileName = VOCODER.Util.OpenSoundFileDialog();
        if (!soundFileName) {
            console.warn('Sound File not selected.');
            return;
        }

        // 音声ファイル内容をモジュレータとして読み込む
        Modulator.LoadSoundFile(soundFileName);
    });
});

