import React, { useEffect, useState } from 'react';
import { Alert, Text, Switch, View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, StyleSheet, Image, Modal, TouchableOpacity, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Input, Label, Screen, Section, Title } from '@/components/UI';
import { RootStackParamList } from '@/navigation/types';
import { getNumberingAccountById, saveNumbering, getAccountsPhotos } from '@/services/numberingService';
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


  const [visible, setVisible] = useState(false);

  const toNullableInt = (value: string): number | null => {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number.parseInt(trimmed, 10);
    return Number.isNaN(parsed) ? null : parsed;
  };

  useEffect(() => {
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
      await saveNumbering({
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
      Alert.alert('Saved', 'Numbering saved locally.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to save');
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
      Alert.alert('Photo Limit', 'You can capture maximum 3 photos for one account.');
      return;
    }

    // Request camera permissions
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your camera!");
      setVisible(false);
      return;
    }

    // Launch the native camera UI
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true, // Allows cropping/rotating
      aspect: [4, 3],
      quality: 0.5,
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
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Screen >
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
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );


};
