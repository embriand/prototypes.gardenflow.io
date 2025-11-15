#!/bin/bash

echo "Generating Korean voiceover files..."
echo ""

mkdir -p voiceover-ko

# Scene 1 (0-4.5s) - 4.5s available
gtts-cli "4단계로 작물을 만드세요." \
  --lang ko \
  --output voiceover-ko/voice_01_intro.mp3

# Scene 2 (4.5-7.5s) - 3.0s available
gtts-cli "플러스 버튼을 클릭하세요." \
  --lang ko \
  --output voiceover-ko/voice_02_fab.mp3

# Scene 3 (7.5-12s) - 4.5s available
gtts-cli "토마토 같은 식물 종류를 선택하세요." \
  --lang ko \
  --output voiceover-ko/voice_03_plant.mp3

# Scene 4 (12-18s) - 6.0s available
gtts-cli "위치를 선택하세요: 프로젝트, 구획, 구역." \
  --lang ko \
  --output voiceover-ko/voice_04_location.mp3

# Scene 5 (18-24s) - 6.0s available
gtts-cli "달력으로 파종과 수확 시기를 정하세요." \
  --lang ko \
  --output voiceover-ko/voice_05_timing.mp3

# Scene 6 (24-27.5s) - 3.5s available
gtts-cli "예상 수확량과 단위를 입력하세요." \
  --lang ko \
  --output voiceover-ko/voice_06_harvest.mp3

# Scene 7 (27.5-32.5s) - 5.0s available
gtts-cli "저장하세요. 작물이 간트 차트에 나타납니다." \
  --lang ko \
  --output voiceover-ko/voice_07_save.mp3

# Scene 8 (32.5-38s) - 5.5s available
gtts-cli "작물 생성 완료! 지금 GardenFlow를 시작하세요." \
  --lang ko \
  --output voiceover-ko/voice_08_final.mp3

echo ""
echo "✓ All Korean voiceover files generated!"
echo ""

# Show durations
for file in voiceover-ko/voice_*.mp3; do
  duration=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$file" 2>&1)
  echo "$file: ${duration}s"
done
