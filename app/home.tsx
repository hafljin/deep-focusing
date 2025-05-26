import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Easing, Platform, Modal, Pressable } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import '../utils/i18n';
import { useTranslation } from 'react-i18next';
import { BookOpen, HelpCircle, Mail } from 'lucide-react-native';

export default function HomeScreen() {
  const { t, i18n } = useTranslation();

  // 多言語対応ジャンル・モード
  const GENRES = [
    { key: 'study', label: t('genres.study') },
    { key: 'nap', label: t('genres.nap') },
    { key: 'workout', label: t('genres.workout') },
    { key: 'work', label: t('genres.work') },
  ];
  const MODES = [
    { key: 'focus', label: i18n.language === 'ja' ? '優しいモード' : 'Gentle Mode' },
    { key: 'strict', label: i18n.language === 'ja' ? 'ハードモード' : 'Hard Mode' },
  ];

  const [selectedGenre, setSelectedGenre] = useState(GENRES[0].key);
  const [focusedGenre, setFocusedGenre] = useState<string | null>(null);
  const [borderProgress, setBorderProgress] = useState(0);
  const [mode, setMode] = useState<'focus' | 'strict'>('focus');
  const [menuVisible, setMenuVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState<'focus' | 'strict' | null>(null);
  const [infoVisible, setInfoVisible] = useState<'howto' | 'contact' | null>(null);
  const [genreDropdownOpen, setGenreDropdownOpen] = useState(false); // プルダウン用ステート

  const fadeMenu = useFadeIn(0);
  const fadePet = useFadeIn(200);
  const fadeGenres = useFadeIn(300);

  // アニメーション用の値
  const borderAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(borderAnim, {
      toValue: borderProgress,
      duration: 500,
      useNativeDriver: false,
      easing: Easing.linear,
    }).start();
  }, [borderProgress]);

  // 円弧の描画用パラメータ
  const size = 220;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [dashOffset, setDashOffset] = useState(circumference);
  React.useEffect(() => {
    const id = borderAnim.addListener(({ value }) => {
      setDashOffset(circumference * (1 - value));
    });
    return () => borderAnim.removeListener(id);
  }, [borderAnim, circumference]);

  // 背景色切り替え
  const backgroundColor = mode === 'strict' ? '#D1D5DB' : '#F6F7F9';

  return (
    <View style={[styles.container, { backgroundColor }]}> 
      {/* 言語切替ボタン */}
      <TouchableOpacity
        style={styles.languageButton}
        onPress={() => i18n.changeLanguage(i18n.language === 'en' ? 'ja' : 'en')}
        activeOpacity={0.7}
      >
        <Text style={styles.languageButtonText}>{i18n.language === 'en' ? '日本語' : 'English'}</Text>
      </TouchableOpacity>
      {/* モード選択プルダウン（タイトルテキスト削除） */}
      <View style={styles.modePickerWrapper}>
        <View style={styles.modePickerBox}>
          {MODES.map((m) => (
            <TouchableOpacity
              key={m.key}
              style={[styles.modePickerItem, mode === m.key && styles.modePickerItemActive]}
              onPress={() => setMode(m.key as 'focus' | 'strict')}
              activeOpacity={0.8}
            >
              <Text style={[styles.modePickerText, mode === m.key && styles.modePickerTextActive]}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {/* モード説明リンク（モード選択の直下に移動） */}
      <View style={[styles.modeDescLinkWrapper, { marginTop: 5 }]}>  {/* 上マージン追加 */}
        {mode === 'focus' && (
          <TouchableOpacity onPress={() => setDialogVisible('focus')} style={{ marginRight: 12 }}>
            <Text style={styles.modeDescLink}>{i18n.language === 'ja' ? '優しいモードとは？' : 'About Gentle Mode'}</Text>
          </TouchableOpacity>
        )}
        {mode === 'strict' && (
          <TouchableOpacity onPress={() => setDialogVisible('strict')}>
            <Text style={styles.modeDescLink}>{i18n.language === 'ja' ? 'ハードモードとは？' : 'About Hard Mode'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {/* カテゴリー（ジャンル）プルダウン化 */}
      <View style={styles.genrePickerWrapper}>
        <TouchableOpacity
          style={styles.genrePickerBox}
          onPress={() => setGenreDropdownOpen((prev) => !prev)}
          activeOpacity={0.8}
        >
          <Text style={styles.genrePickerText}>{GENRES.find((g) => g.key === selectedGenre)?.label}</Text>
          <Ionicons name={genreDropdownOpen ? 'chevron-up' : 'chevron-down'} size={20} color="#26A69A" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
        {genreDropdownOpen && (
          <View style={styles.genreDropdown}>
            {GENRES.map((g) => (
              <TouchableOpacity
                key={g.key}
                style={styles.genreDropdownItem}
                onPress={() => { setSelectedGenre(g.key); setGenreDropdownOpen(false); }}
                activeOpacity={0.85}
              >
                <Text style={styles.genreDropdownText}>{g.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      {/* 左上の3点リーダー */}
      <Animated.View style={[styles.menuButton, fadeMenu]}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="ellipsis-horizontal" size={28} color={Colors.neutral[700]} />
        </TouchableOpacity>
      </Animated.View>
      <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <Pressable style={styles.menuOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuModal}>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setInfoVisible('howto'); setMenuVisible(false); }}>
              <HelpCircle size={20} color="#26A69A" style={{ marginRight: 8 }} />
              <Text style={styles.menuItemText}>{t('menu.howto')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setInfoVisible('contact'); setMenuVisible(false); }}>
              <Mail size={20} color="#26A69A" style={{ marginRight: 8 }} />
              <Text style={styles.menuItemText}>{t('menu.contact')}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
      {/* How to/Contact モーダル */}
      <Modal visible={infoVisible === 'howto'} transparent animationType="fade" onRequestClose={() => setInfoVisible(null)}>
        <Pressable style={styles.menuOverlay} onPress={() => setInfoVisible(null)}>
          <View style={styles.infoModal}>
            <HelpCircle size={32} color="#26A69A" style={{ marginBottom: 8 }} />
            <Text style={styles.infoTitle}>{t('howto.title')}</Text>
            <Text style={styles.infoDesc}>{t('howto.desc')}</Text>
          </View>
        </Pressable>
      </Modal>
      <Modal visible={infoVisible === 'contact'} transparent animationType="fade" onRequestClose={() => setInfoVisible(null)}>
        <Pressable style={styles.menuOverlay} onPress={() => setInfoVisible(null)}>
          <View style={styles.infoModal}>
            <Mail size={32} color="#26A69A" style={{ marginBottom: 8 }} />
            <Text style={styles.infoTitle}>{t('contact.title')}</Text>
            <Text style={styles.infoDesc}>{t('contact.desc')}</Text>
          </View>
        </Pressable>
      </Modal>
      {/* ペット画像＋アニメーションボーダー */}
      <Animated.View style={[styles.petContainer, fadePet]}> 
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
          <Image source={require('../assets/images/pet.jpg')} style={styles.petImage} />
          <Animated.View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Svg width={size} height={size}>
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#26A69A"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${circumference},${circumference}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                rotation="-90"
                origin={`${size / 2},${size / 2}`}
              />
            </Svg>
          </Animated.View>
        </View>
      </Animated.View>
      {/* モード選択 */}
      <Modal visible={dialogVisible !== null} transparent animationType="fade" onRequestClose={() => setDialogVisible(null)}>
        <Pressable style={styles.menuOverlay} onPress={() => setDialogVisible(null)}>
          <Animated.View style={[styles.infoModal, { alignItems: 'center' }]}> 
            {/* バツボタン */}
            <TouchableOpacity style={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }} onPress={() => setDialogVisible(null)}>
              <Ionicons name="close" size={28} color="#607D8B" />
            </TouchableOpacity>
            {dialogVisible === 'focus' ? (
              <BookOpen size={40} color="#26A69A" style={{ marginBottom: 8 }} />
            ) : (
              <Ionicons name="lock-closed-outline" size={40} color="#00796B" style={{ marginBottom: 8 }} />
            )}
            <Text style={styles.infoTitle}>{dialogVisible === 'focus' ? (i18n.language === 'ja' ? '優しいモード' : 'Gentle Mode') : (i18n.language === 'ja' ? 'ハードモード' : 'Hard Mode')}</Text>
            <Text style={styles.infoDesc}>{dialogVisible === 'focus' ? t('modes.focus_desc') : t('modes.strict_desc')}</Text>
            <Animated.View style={{ marginTop: 12, opacity: fadeGenres.opacity }}>
              <Image source={require('../assets/images/pet.jpg')} style={{ width: 60, height: 60, borderRadius: 30 }} />
            </Animated.View>
          </Animated.View>
        </Pressable>
      </Modal>
      {/* タイマー */}
      <PomodoroTimer onProgress={setBorderProgress} />
    </View>
  );
}

function useFadeIn(delay = 0) {
  const anim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 600,
      delay,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
  }, [anim, delay]);
  return { opacity: anim };
}

function PomodoroTimer({ onProgress }: { onProgress?: (progress: number) => void }) {
  const [seconds, setSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isRunning && seconds > 0) {
      timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      if (onProgress) {
        const total = isBreak ? 5 * 60 : 25 * 60;
        onProgress(1 - seconds / total);
      }
    } else if (isRunning && seconds === 0) {
      setIsBreak(!isBreak);
      setSeconds(isBreak ? 25 * 60 : 5 * 60);
      if (onProgress) onProgress(0);
    }
    return () => clearTimeout(timer);
  }, [isRunning, seconds, isBreak, onProgress]);

  const format = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const fadeAnim = useFadeIn(400);

  return (
    <Animated.View style={[styles.timerContainer, fadeAnim]}>
      <Text style={styles.timerLabel}>{isBreak ? '休憩' : '集中'}</Text>
      <Text style={styles.timer}>{format(seconds)}</Text>
      <TouchableOpacity
        style={styles.timerButton}
        onPress={() => setIsRunning(!isRunning)}
        activeOpacity={0.85}
      >
        <Text style={styles.timerButtonText}>{isRunning ? '一時停止' : 'スタート'}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#F6F7F9', // 削除: 動的に切り替え
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 60,
  },
  modePickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: Platform.OS === 'ios' ? 8 : 0,
  },
  modePickerLabel: {
    fontSize: 16,
    color: '#607D8B',
    marginRight: 8,
    fontFamily: 'Inter-Medium',
  },
  modePickerBox: {
    flexDirection: 'row',
    backgroundColor: '#E0E7EF',
    borderRadius: 16,
    padding: 2,
  },
  modePickerItem: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'transparent',
  },
  modePickerItemActive: {
    backgroundColor: '#B2DFDB',
  },
  modePickerText: {
    color: '#607D8B',
    fontSize: 15,
    fontFamily: 'Inter-Medium',
  },
  modePickerTextActive: {
    color: '#00796B',
    fontFamily: 'Inter-Bold',
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  petContainer: {
    marginTop: 20,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#B2DFDB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  petImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#e0f2f1',
  },
  genrePickerWrapper: {
    marginBottom: 24,
    width: '100%',
    alignItems: 'center', // 中央揃え
    justifyContent: 'center', // 追加: 完全中央揃え
  },
  genrePickerBox: {
    flexDirection: 'row',
    backgroundColor: '#E0E7EF',
    borderRadius: 16,
    padding: 12,
    paddingVertical: 14,
    alignItems: 'center',
    width: 220, // モード選択と同じくらいの横幅に調整
    minWidth: 180, // 追加: 最小幅指定でバランス
    maxWidth: 260, // 追加: 最大幅指定でバランス
    justifyContent: 'center', // 追加: テキスト中央
    shadowColor: '#B2DFDB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  genrePickerText: {
    flex: 1,
    color: '#607D8B',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  genreDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 8,
    paddingVertical: 4,
    width: 220, // ドロップダウンも同じ横幅
    shadowColor: '#B2DFDB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },
  genreDropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  genreDropdownText: {
    color: '#607D8B',
    fontSize: 15,
    fontFamily: 'Inter-Medium',
  },
  timerContainer: {
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    paddingVertical: 48,
    paddingHorizontal: 24,
    width: '90%',
    minHeight: 220,
    shadowColor: '#B2DFDB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
    justifyContent: 'center',
  },
  timerLabel: {
    fontSize: 22,
    color: '#26A69A',
    marginBottom: 12,
    fontFamily: 'Inter-SemiBold',
  },
  timer: {
    fontSize: 72,
    fontFamily: 'Inter-Bold',
    color: '#263238',
    marginBottom: 18,
  },
  timerButton: {
    backgroundColor: '#26A69A',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 28,
    marginTop: 12,
    shadowColor: '#B2DFDB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },
  timerButtonPressed: {
    backgroundColor: '#00897B',
  },
  timerButtonText: {
    color: '#fff',
    fontSize: 22,
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 1,
  },
  languageButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    shadowColor: '#B2DFDB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },
  languageButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#607D8B',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuModal: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    minWidth: 220,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    width: '100%',
  },
  menuItemText: {
    fontSize: 16,
    color: '#263238',
    fontFamily: 'Inter-Medium',
  },
  infoModal: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    minWidth: 260,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  infoTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#26A69A',
    marginBottom: 8,
    textAlign: 'center',
  },
  infoDesc: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#607D8B',
    textAlign: 'center',
    marginBottom: 4,
  },
  modeDescLinkWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
    marginTop: -8,
  },
  modeDescLink: {
    fontSize: 12,
    color: '#26A69A',
    textDecorationLine: 'underline',
    fontFamily: 'Inter-Medium',
  },
});
