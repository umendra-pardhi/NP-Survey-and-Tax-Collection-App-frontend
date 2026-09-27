import React, { useEffect, useState } from 'react';
import { Text, Switch, View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, StyleSheet, Image, Modal, TouchableOpacity, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Input, Label, Screen, Section, Title } from '@/components/UI';
import { Toast } from '@/components/Toast';
import { RootStackParamList } from '@/navigation/types';
import {
  chooseNumberingPhotoExportDirectory,
  getNumberingAccountById,
  getAccountsPhotos,
  getNumberingPhotoExportDirectory,
  saveNumbering,
} from '@/services/numberingService';
import { NumberingAccount } from '@/types';
import * as ImagePicker from 'expo-image-picker';
import IconButton from '@/components/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'NumberingForm'>;

type CapturedPhoto = {
  uri: string;
  fileName: string;
  mimeType: string;
};

type AccountPhoto = {
  ImageId: number;
  ACID: number;
  FileName: string;
  MimeType: string;
  ImagePath: string;
};

export const NumberingFormScreen = ({ route, navigation }: Props) => {
  const [property, setProperty] = useState<NumberingAccount | null>(null);
  const [zid, setZid] = useState('');
  const [wardNo, setWardNo] = useState('');
  const [propertyNo, setPropertyNo] = useState('');
  const [partNo, setPartNo] = useState('');
  const [citySurveyNo, setCitySurveyNo] = useState('');
  const [plotNo, setPlotNo] = useState('');
  const [address, setAddress] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [buildingNo, setBuildingNo] = useState('');
  const [remarks, setRemarks] = useState('');
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [existingPhotoCount, setExistingPhotoCount] = useState(0);
  const [hasGharkul, setHasGharkul] = useState(false);
  const [accountPhotos, setAccountPhotos] = useState<AccountPhoto[]>([]);
  const [photoExportConfigured, setPhotoExportConfigured] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  const [visible, setVisible] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const toNullableInt = (value: string): number | null => {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number.parseInt(trimmed, 10);
    return Number.isNaN(parsed) ? null : parsed;
  };

  useEffect(() => {
    getNumberingPhotoExportDirectory().then((directory) => {
      setPhotoExportConfigured(!!directory);
    });
    getNumberingAccountById(route.params.propertyId).then((p) => {
      setProperty(p ?? null);
      if (!p) return;
      setZid(p.zid != null ? String(p.zid) : '');
      setWardNo(p.ward_no != null ? String(p.ward_no) : '');
      setPropertyNo(p.property_no != null ? String(p.property_no) : '');
      setPartNo(p.part_no != null ? String(p.part_no) : '');
      setCitySurveyNo(p.city_survey_no);
      setPlotNo(p.plot_no);
      setRemarks(p.numbering_remarks);
      setHasGharkul(!!p.has_gharkul);
      setAddress(p.address);
      setBuildingName(p.building_name);
      setBuildingNo(p.building_no);
    });
    getAccountsPhotos(route.params.propertyId).then((savedPhotos) => {
      setAccountPhotos(savedPhotos);
      setExistingPhotoCount(savedPhotos.length);
    });

  }, [route.params.propertyId]);

  const onSave = async () => {
    try {
      if (!property) return;
      const result = await saveNumbering({
        propertyId: property.id,
        wardNo: toNullableInt(wardNo),
        propertyNo: toNullableInt(propertyNo),
        partNo: toNullableInt(partNo),
        address,
        buildingName,
        buildingNo,
        hasGharkul,
        remarks,
        photos: photos.map(({ uri, fileName, mimeType }) => ({ uri, fileName, mimeType })),
      });
      const exportMessage = result.failedExports > 0
        ? ` ${result.failedExports} photo(s) could not be copied to the selected folder.`
        : result.exportedPhotos > 0
          ? ` ${result.exportedPhotos} photo(s) copied to the selected folder.`
          : '';
      showToast(`Numbering saved locally.${exportMessage}`, result.failedExports > 0 ? 'info' : 'success');
      setTimeout(() => navigation.goBack(), 300);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to save', 'error');
    }
  };

  const choosePhotoFolder = async () => {
    try {
      const directory = await chooseNumberingPhotoExportDirectory();
      if (!directory) {
        showToast('No photo folder selected.', 'info');
        return;
      }
      setPhotoExportConfigured(true);
      showToast('Photos will be copied to NPA_Property_Photos in the selected folder.', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not access that folder.', 'error');
    }
  };

  // const pickImageAsync = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ['images'],
  //     allowsEditing: true,
  //     quality: 0.3,
  //     base64: true,
  //   });

  //   if (!result.canceled) {
  //     setSelectedImage(result.assets[0].uri);
  //     setPhotoBase64(result.assets[0].base64 ?? '');
  //     setVisible(false);
  //   } else {
  //     alert('You did not select any image.');
  //   }
  // };

  const styles = StyleSheet.create({
    image: { width: 350, height: 250, marginTop: 20, borderRadius: 10 },
  });

  const takePhoto = async () => {
    if (existingPhotoCount + photos.length >= 3) {
      showToast('You can capture maximum 3 photos for one account.', 'info');
      return;
    }

    // Request camera permissions
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      showToast('Camera access was denied.', 'error');
      setVisible(false);
      return;
    }

    // Launch the native camera UI
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true, // Allows cropping/rotating
      aspect: [4, 3],
      quality: 0.3,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setPhotos((current) => [
        ...current,
        {
          uri: asset.uri,
          fileName: asset.fileName || `account_${route.params.propertyId}_${Date.now()}.jpg`,
          mimeType: asset.mimeType || 'image/jpeg',
        },
      ]);
      setVisible(false);
    }
  };

  const removePhoto = (indexToRemove: number) => {
    setPhotos((current) => current.filter((_, index) => index !== indexToRemove));
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, position: 'relative' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <Screen>
              <Title>Numbering Form</Title>
              <Section>
                <Text>मालकाचे नाव: {property?.owner_name}</Text>
                <Text>भोगवटदाराचे नाव: {property?.holder_name}</Text>
                <Text>मोबाइल नंबर: {property?.mobile_no}</Text>
                <Text>जुना वॉर्ड क्र. : {property?.o_ward_no != null ? String(property.o_ward_no) : ''}</Text>
                <Text>जुना मिळकत क्र. : {property?.o_property_no ?? ''}</Text>
                <Text>जुना झोन क्र. : {property?.o_zid != null ? String(property.o_zid) : ''}</Text>
                <Text>जुना ऑनलाइन क्र. : {property?.o_online_no ?? ''}</Text>
                <Text>जुना चालू कर : {property?.o_total_tax != null ? String(property.o_total_tax) : ''}</Text>
              </Section>

              <Text style={{ marginTop: 0, fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>--- नवीन माहिती भरा ---</Text>

              <Section>
                <Label>नवा वॉर्ड क्र. (WardNo)</Label>
                <Input value={wardNo} onChangeText={setWardNo} />
                <Label>नवा मिळकत क्र. (PropertyNo)</Label>
                <Input value={propertyNo} onChangeText={setPropertyNo} />
                <Label>नवा भाग क्र. (PartNo)</Label>
                <Input value={partNo} onChangeText={setPartNo} />

                <Label>Address</Label>
                <Input value={address} onChangeText={setAddress} />
                <Label>Building Name</Label>
                <Input value={buildingName} onChangeText={setBuildingName} />
                <Label>Building No</Label>
                <Input value={buildingNo} onChangeText={setBuildingNo} />

                <Label>Remarks (NumberingRemarks)</Label>
                <Input value={remarks} multiline={true} numberOfLines={4} onChangeText={setRemarks} />
                <Label>घरकुल आहे का?</Label>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                  <Text> {hasGharkul ? 'होय ' : 'नाही '} </Text>
                  <Switch value={!!hasGharkul} onValueChange={setHasGharkul} style={{ alignSelf: 'flex-start', transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }], }} />
                </View>
                <Label>Photo</Label>

                <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 12 }}>
                  <IconButton
                    label={photoExportConfigured ? 'Change Photo Folder' : 'Choose Download Folder'}
                    onPress={choosePhotoFolder}
                  />
                  <Text style={{ marginTop: 8 }}>
                    {photoExportConfigured
                      ? 'Photos will be stored in NPA_Property_Photos.'
                      : 'Choose a folder before saving photos.'}
                  </Text>
                  <IconButton label={`Take Photo (${existingPhotoCount + photos.length}/3)`} onPress={takePhoto} />
                  {existingPhotoCount > 0 && (
                    <Text style={{ marginTop: 8 }}>Saved photos: {existingPhotoCount}</Text>
                  )}
                  {accountPhotos.map((photo) => (
                    <View key={photo.ImageId} style={{ alignItems: 'center' }}>
                      <Image source={{ uri: photo.ImagePath }} style={styles.image} />
                      <Text style={{ marginTop: 6 }}>{photo.FileName}</Text>
                    </View>
                  ))}
                  {photos.map((photo, index) => (
                    <View key={`${photo.uri}-${index}`} style={{ alignItems: 'center' }}>
                      <Image source={{ uri: photo.uri }} style={styles.image} />
                      <Pressable onPress={() => removePhoto(index)} style={{ marginTop: 8 }}>
                        <Text style={{ color: '#BC3908', fontWeight: '700' }}>Remove Photo</Text>
                      </Pressable>
                    </View>
                  ))}
                </View>

                <Button text="Save Numbering" onPress={onSave} />
              </Section>
            </Screen>
          </View>
        </TouchableWithoutFeedback>

        <Toast
          visible={toastVisible}
          message={toastMessage}
          type={toastType}
          onHide={() => setToastVisible(false)}
        />
      </View>
    </KeyboardAvoidingView>
  );


};
