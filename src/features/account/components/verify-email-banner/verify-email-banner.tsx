import { Pressable, Text, View } from 'react-native';

interface IVerifyEmailBannerProps {
  isSending: boolean;
  onResend: () => void;
}

export function VerifyEmailBanner({
  isSending,
  onResend,
}: IVerifyEmailBannerProps) {
  return (
    <View
      accessibilityRole="alert"
      className="flex-row items-center gap-2.5 rounded-xl border border-accent-border-color bg-accent-soft-bg-color p-3"
    >
      <Text className="flex-1 font-sans text-[13px] leading-[18px] text-primary-text-color">
        E-mail not confirmed yet
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isSending }}
        disabled={isSending}
        onPress={onResend}
        className="h-9 justify-center rounded-lg border border-accent-bg-color px-3 disabled:opacity-60"
      >
        <Text className="font-semibold text-[13px] text-accent-text-color">
          {isSending ? 'Sending…' : 'Resend'}
        </Text>
      </Pressable>
    </View>
  );
}
