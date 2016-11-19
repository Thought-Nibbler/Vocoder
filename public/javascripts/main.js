$(function() {
    console.info('Start "Vocoder".');

    var Modulator = new VOCODER.Modulator();
    var Carrier   = new VOCODER.Carrier();

    // ウィンドウの内部要素の更新（ウィンドウリサイズ時・可視状態の変更時）
    var RefreshWindow = function() {
    };

    // ウィンドウサイズへのフィット処理
    (function() {
        $(window).on('resize', RefreshWindow);
    }());

    (function() {
        /*
        var oscillator = VOCODER.audioCtx.createOscillator();

        oscillator.connect(VOCODER.audioCtx.destination);

        oscillator.start();
        */
    }());

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

    RefreshWindow();
});

