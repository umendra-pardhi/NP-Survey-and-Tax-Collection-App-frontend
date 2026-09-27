import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { Button, Screen, Section, Title } from '@/components/UI';
import { downloadFromServer, getSyncLogs, uploadToServer } from '@/services/syncService';

type SyncLog = { id: number; status: string; message: string; created_at: string };

export const SyncScreen = () => {
  const { config } = useAuth();
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');

  const refreshLogs = async () => setLogs(await getSyncLogs());

  useEffect(() => {
    refreshLogs();
  }, []);

  const onDownload = async () => {
    try {
      if (!config) throw new Error('Setup not completed');
      setIsDownloading(true);
      setDownloadStatus('Starting download...');
      const counts = await downloadFromServer(config, {
        onStatus: setDownloadStatus,
      });
      await refreshLogs();
      Alert.alert('Success', `${counts.accounts} account records downloaded`);
    } catch (error) {
      Alert.alert('Download Failed', error instanceof Error ? error.message : 'Failed');
    } finally {
      setIsDownloading(false);
    }
  };

  const onUpload = async () => {
    try {
      if (!config) throw new Error('Setup not completed');
      setIsUploading(true);
      setUploadStatus('Starting upload...');
      const counts = await uploadToServer(config, { onStatus: setUploadStatus });
      await refreshLogs();
      Alert.alert('Upload Complete', `${counts.records} records streamed`);
    } catch (error) {
      Alert.alert('Upload Failed', error instanceof Error ? error.message : 'Failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Screen>
      <Title>Sync Dashboard</Title>
      <Button text="Download Data (Remote -> Local)" onPress={onDownload} />
      <Button text="Upload Data (Local -> Remote)" variant="secondary" onPress={onUpload} />
      <Section>
        <Text style={{ fontWeight: '700', marginBottom: 8 }}>Sync Logs</Text>
        {logs.map((log) => (
          <Text key={log.id} style={{ marginBottom: 6 }}>
            [{log.status}] {log.message}
          </Text>
        ))}
      </Section>
      <Modal visible={isDownloading} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.dialog}>
            <ActivityIndicator size="large" color="#145DA0" />
            <Text style={styles.dialogTitle}>Downloading Accounts</Text>
            <Text style={styles.dialogStatus}>{downloadStatus}</Text>
          </View>
        </View>
      </Modal>
      <Modal visible={isUploading} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.dialog}>
            <ActivityIndicator size="large" color="#145DA0" />
            <Text style={styles.dialogTitle}>Uploading Local Changes</Text>
            <Text style={styles.dialogStatus}>{uploadStatus}</Text>
          </View>
        </View>
      </Modal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: 24,
  },
  dialog: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    gap: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  dialogTitle: {
    color: '#1B1D2A',
    fontSize: 16,
    fontWeight: '700',
  },
  dialogStatus: {
    color: '#4B5563',
    fontSize: 14,
    textAlign: 'center',
  },
});
