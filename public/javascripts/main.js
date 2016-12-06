$(function() {
    console.info('Start "Vocoder".');

    var reloadFunc = function() {
        // モジュレータ音色の倍音構成を取得する
        var overtone = Modulator.GetOvertone();

        Carrier.reloadWave(overtone);
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

