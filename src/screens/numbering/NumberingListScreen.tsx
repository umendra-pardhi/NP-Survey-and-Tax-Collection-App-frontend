import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, Text, View, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Input, Label, Section, Title } from '@/components/UI';
import { RootStackParamList } from '@/navigation/types';
import { searchNumberingAccounts, getOwnerNames, getWardNumbers, getPropertyNumbers } from '@/services/numberingService';
import { NumberingAccount } from '@/types';
import DropDownPicker from 'react-native-dropdown-picker';

export const NumberingListScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [wardNo, setWardNo] = useState<string | null>(null);
  const [propertyNo, setPropertyNo] = useState<string | null>(null);

  const [rows, setRows] = useState<NumberingAccount[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'done'>('pending');

  const filteredRows = rows.filter((row) => {
    if (statusFilter === 'done') return row.numbering_done === 1;
    if (statusFilter === 'pending') return row.numbering_done !== 1;
    return true;
  });

  const [wardOpen, setWardOpen] = useState(false);
  const [wardItems, setWardItems] = useState<{ label: string; value: string }[]>([]);

  const [propertyOpen, setPropertyOpen] = useState(false);
  const [propertyItems, setPropertyItems] = useState<{ label: string; value: string }[]>([]);


  const [ownerName, setOwnerName] = useState<string | null>(null);
  const [ownerOpen, setOwnerOpen] = useState(false);
  const [ownerItems, setOwnerItems] = useState<{ label: string; value: string }[]>([]);

  const [loading, setLoading] = useState(false);
  const [isSwitchingStatus, setIsSwitchingStatus] = useState(false);
  const statusSwitchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // const [holderName, setHolderName] = useState<string | null>(null);
  // const [holderOpen, setHolderOpen] = useState(false);
  // const [holderItems, setHolderItems] = useState<{ label: string; value: string }[]>([]);


  useEffect(() => {

    const loadWardNumbers = async () => {
      const wards = await getWardNumbers();
      setWardNo('');
      setPropertyNo('');
      setWardItems(wards.map((w) => ({ label: w, value: w })));
    };
    // const loadHolders = async () => {
    //   const holders = await getHolderNames(); // Implement this function to fetch holder names
    //   setHolderItems(holders.map((holder) => ({ label: holder, value: holder })));

    // };
    // loadHolders(); 
    loadWardNumbers();

  }, []);

  useEffect(() => {
    const loadOwners = async () => {
      const owners = await getOwnerNames({
        wardNo: wardNo ?? '',
        propertyNo: propertyNo ?? '',
      });
      setOwnerItems(owners.map((owner) => ({ label: owner, value: owner })));
      if (ownerName && !owners.includes(ownerName)) {
        setOwnerName(null);
      }
    };
    loadOwners();

  }, [wardNo, propertyNo]);

  useEffect(() => {
    const loadPropertyNumbers = async () => {
      if (!wardNo) {
        setPropertyNo('');
        setPropertyItems([]);
        return;
      }
      const properties = await getPropertyNumbers(wardNo);
      setPropertyNo('');
      setPropertyItems(properties.map((p) => ({ label: p, value: p })));
    };
    loadPropertyNumbers();

  }, [wardNo]);



  const runSearch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await searchNumberingAccounts({
        wardNo: wardNo ?? '',
        propertyNo: propertyNo ?? '',
        ownerName: ownerName ?? '',
      });

      setRows(result);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  }, [wardNo, propertyNo, ownerName]);

  useFocusEffect(
    useCallback(() => {
      void runSearch();
    }, [runSearch]),
  );

  useEffect(() => () => {
    if (statusSwitchTimer.current) clearTimeout(statusSwitchTimer.current);
  }, []);

  const switchStatusFilter = (status: 'all' | 'pending' | 'done') => {
    if (statusSwitchTimer.current) clearTimeout(statusSwitchTimer.current);
    setIsSwitchingStatus(true);
    statusSwitchTimer.current = setTimeout(() => {
      setStatusFilter(status);
      setIsSwitchingStatus(false);
      statusSwitchTimer.current = null;
    }, 150);
  };


  return (
    <>
      <FlatList
        style={{ flex: 1, backgroundColor: '#F6F7FB' }}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        data={filteredRows}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={
          <View style={{ gap: 12, marginBottom: 12 }}>
            <Title>Property List (Numbering)</Title>
            <View style={{ flexDirection: 'row', borderRadius: 8, backgroundColor: '#E7EAF0', padding: 4 }}>
              {([
                { label: 'All', value: 'all' },
                { label: 'Pending', value: 'pending' },
                { label: 'Completed', value: 'done' },
              ] as const).map((option) => {
                const selected = statusFilter === option.value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => switchStatusFilter(option.value)}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      paddingVertical: 9,
                      borderRadius: 6,
                      backgroundColor: selected ? '#FFFFFF' : 'transparent',
                    }}
                  >
                    <Text style={{ color: selected ? '#145DA0' : '#555', fontWeight: selected ? '700' : '500' }}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Section>
              <Label>Ward No</Label>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <DropDownPicker
                    open={wardOpen}
                    value={wardNo}
                    items={wardItems}
                    setOpen={setWardOpen}
                    setValue={setWardNo}
                    setItems={setWardItems}
                    placeholder="Select ward"

                    searchable={true}
                    searchPlaceholder="Search ward..."

                    listMode="MODAL"
                    modalProps={{
                      animationType: 'slide',
                    }}
                    modalContentContainerStyle={{
                      width: '95%',
                      height: '80%',
                      alignSelf: 'center',
                      borderRadius: 12,
                      padding: 10,
                    }}
                  />
                </View>
                {

                  wardNo &&
                  <TouchableOpacity onPress={() => setWardNo(null)}>
                    <Text style={{ fontSize: 18, paddingHorizontal: 10 }}>✕</Text>
                  </TouchableOpacity>
                }
              </View>
              {/* <Input keyboardType="numeric" value={wardNo} onChangeText={setWardNo} /> */}
              <Label>Property No</Label>
              {/* <Input keyboardType="numeric" value={propertyNo} onChangeText={setPropertyNo} /> */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <DropDownPicker
                    open={propertyOpen}
                    value={propertyNo}
                    items={propertyItems}
                    setOpen={setPropertyOpen}
                    setValue={setPropertyNo}
                    setItems={setPropertyItems}
                    placeholder="Select property"

                    searchable={true}
                    searchPlaceholder="Search property..."

                    listMode="MODAL"
                    modalProps={{
                      animationType: 'slide',
                    }}
                    modalContentContainerStyle={{
                      width: '95%',
                      height: '80%',
                      alignSelf: 'center',
                      borderRadius: 12,
                      padding: 10,
                    }}
                  />
                </View>

                {propertyNo && <TouchableOpacity onPress={() => setPropertyNo(null)}>
                  <Text style={{ fontSize: 18, paddingHorizontal: 10 }}>✕</Text>
                </TouchableOpacity>
                }
              </View>
              <Label>Owner Name</Label>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <DropDownPicker
                    open={ownerOpen}
                    value={ownerName}
                    items={ownerItems}
                    setOpen={setOwnerOpen}
                    setValue={setOwnerName}
                    setItems={setOwnerItems}
                    placeholder="Select owner"

                    searchable={true}
                    searchPlaceholder="Search owner..."


                    listMode="MODAL"
                    modalProps={{
                      animationType: 'slide',
                    }}
                  // modalContentContainerStyle={{
                  //   width: '95%',
                  //   height: '80%',
                  //   alignSelf: 'center',
                  //   borderRadius: 12,
                  //   padding: 10,
                  // }}
                  />
                </View>

                {ownerName && <TouchableOpacity onPress={() => setOwnerName(null)}>
                  <Text style={{ fontSize: 18, paddingHorizontal: 10 }}>✕</Text>
                </TouchableOpacity>}
              </View>

              {/* <Label>Holder Name</Label>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <DropDownPicker
                  open={holderOpen}
                  value={holderName}
                  items={holderItems}
                  setOpen={setHolderOpen}
                  setValue={setHolderName}
                  setItems={setHolderItems}
                  placeholder="Select holder"

                  searchable={true}
                  searchPlaceholder="Search holder..."

                  listMode="MODAL"
                  modalProps={{
                    animationType: 'slide',
                  }}
                />

              </View>
            { holderName && <TouchableOpacity onPress={() => setHolderName(null)}>
                <Text style={{ fontSize: 18, paddingHorizontal: 10 }}>✕</Text>
              </TouchableOpacity>}
            </View> */}
              {/* <Text >  Total Records: {rows.length} </Text> */}
              {/* <Pressable onPress={runSearch} style={{ backgroundColor: '#145DA0', borderRadius: 10, padding: 12 }}>
              <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>Search</Text>
            </Pressable> */}
            </Section>
            <Section>
              <Text style={{ fontWeight: '700' }}>Search Results : {filteredRows.length}</Text>
            </Section>
          </View>
        }
        renderItem={({ item }) => (
          <Section>
            <Pressable onPress={() => navigation.navigate('NumberingForm', { propertyId: item.id })} style={{ paddingVertical: 8 }}>
              <Text style={{ fontWeight: '700' }}>
                Ward no: {item.ward_no ?? '-'} | Property no: {item.property_no ?? '-'}
              </Text>
              <Text>Owner: {item.owner_name}</Text>
              <Text>Holder: {item.holder_name}</Text>
              <Text style={{ color: item.numbering_done === 1 ? '#10B981' : '#F59E0B' }}>
                {item.numbering_done === 1 ? 'Done' : 'Pending'}
              </Text>
            </Pressable>
          </Section>
        )}
        ListEmptyComponent={
          hasSearched ? (
            <Section>
              <Text style={{ textAlign: 'center', color: '#555' }}>No records found.</Text>
            </Section>
          ) : null
        }
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
      <Modal transparent visible={loading || isSwitchingStatus} animationType="fade" onRequestClose={() => { }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.35)' }}>
          <View style={{ minWidth: 150, alignItems: 'center', gap: 12, padding: 20, borderRadius: 10, backgroundColor: '#FFFFFF' }}>
            <ActivityIndicator size="large" color="#145DA0" />
            <Text style={{ color: '#2B2D3A', fontWeight: '600' }}>
              {isSwitchingStatus ? 'Updating list...' : 'Loading...'}
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
};
