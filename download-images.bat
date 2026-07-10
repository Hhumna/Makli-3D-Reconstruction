@echo off
cd /d "C:\Users\Hp\3DReconstruction-of-Makli\public\images"

echo Downloading Makli images...
echo.

REM Overview of Makli Hills
echo Downloading hero-skyline.jpg...
curl -L -o hero-skyline.jpg "https://commons.wikimedia.org/wiki/Special:FilePath/Overview_of_Makli_Hills.jpg" 2>nul

REM Tile detail
echo Downloading tile-detail.jpg...
curl -L -o tile-detail.jpg "https://commons.wikimedia.org/wiki/Special:FilePath/PK_Thatta_asv2020-02_img15_Makli_Necropolis.jpg" 2>nul

REM Carving detail  
echo Downloading carving-detail.jpg...
curl -L -o carving-detail.jpg "https://commons.wikimedia.org/wiki/Special:FilePath/PK_Thatta_asv2020-02_img11_Makli_Necropolis.jpg" 2>nul

REM Jam Nizamuddin Tomb
echo Downloading tomb-jam-nizamuddin.jpg...
curl -L -o tomb-jam-nizamuddin.jpg "https://commons.wikimedia.org/wiki/Special:FilePath/Tomb_of_Sultan_Jam_Nizamuddin.jpg" 2>nul

REM Isa Khan Tomb
echo Downloading tomb-isa-khan.jpg...
curl -L -o tomb-isa-khan.jpg "https://commons.wikimedia.org/wiki/Special:FilePath/Isa_Khan_Tomb_Entrance.jpg" 2>nul

echo.
echo Done. Files:
dir *.jpg

pause
