# will-sql : Document Classes Usage

Library `will-sql` สำหรับจัดการและเชื่อมต่อฐานข้อมูลหลากหลายประเภท (เช่น Microsoft SQL Server, MySQL, ODBC, Oracle, PostgreSQL, และ SQLite) 
เอกสารนี้อธิบายการทำงานของระดับ Class, Function, Interface, และตัวแปรชนิดต่างๆ ทั้งหมดที่มีอยู่ในโฟลเดอร์ `src/db/`

---

## 📚 สารบัญ
- [Classes & Interfaces](#classes--interfaces)
  - [KnDBConnect](#kndbconnect)
  - [KnDBConnections](#kndbconnections)
  - [KnDBError](#kndberror)
  - [KnDBFault](#kndbfault)
  - [KnDBLibrary](#kndblibrary)
  - [KnDBUtils](#kndbutils)
  - [KnSQL](#knsql)
  - [KnDBConnector](#kndbconnector)
  - [KnSQLInterface](#knsqlinterface)
- [Constants & Variables](#constants--variables)
  - [KnDBVariable](#kndbvariable)
- [Data Structures & Types](#data-structures--types)
  - [Enums](#enums)
  - [KnDBConfig](#kndbconfig)
  - [KnDBValue](#kndbvalue)
  - [KnDBParam](#kndbparam)
  - [KnDBParamValue](#kndbparamvalue)
  - [KnPageOffset](#knpageoffset)
  - [KnResultSet](#knresultset)
  - [KnRecordSet](#knrecordset)
  - [KnSQLOptions](#knsqloptions)

---

## Classes & Interfaces

### KnDBConnect
เป็น Abstract Class หลักในการทำงาน (Implements `KnDBConnector`) ซึ่งทำหน้าที่เป็นแบบแผนสำหรับการเชื่อมต่อฐานข้อมูลในแต่ละยี่ห้อ (Dialect)

**Functions:**
- init(): Promise<void>
  - เตรียมความพร้อมและเริ่มต้นการทำงาน
- getConnection(): Promise<any>
  - ดึงข้อมูล Connection จาก Database Driver ด้านใน
- executeQuery(sql: string | [KnSQLOptions](#knsqloptions), params?: [KnDBParam](#kndbparam) | Array<any>, ctx?: any): Promise<[KnResultSet](#knresultset)>
  - ประมวลผลคำสั่ง Query ค้นหาข้อมูล (เช่น SELECT) คืนค่าออกมาเป็นผลลัพธ์แบบ KnResultSet
- executeUpdate(sql: string | [KnSQLOptions](#knsqloptions), params?: [KnDBParam](#kndbparam) | Array<any>, ctx?: any): Promise<[KnResultSet](#knresultset)>
  - ประมวลผลคำสั่งที่เกิดผลเปลี่ยนแปลงข้อมูล (เช่น INSERT, UPDATE, DELETE)
- execQuery(sql: [KnSQLInterface](#knsqlinterface), ctx?: any): Promise<[KnResultSet](#knresultset)>
  - ใช้ KnSQL ส่งเข้าประมวลผลคำสั่งค้นหาข้อมูล
- execUpdate(sql: [KnSQLInterface](#knsqlinterface), ctx?: any): Promise<[KnResultSet](#knresultset)>
  - ใช้ KnSQL ส่งเข้าประมวลผลเพื่อแก้ไขข้อมูล
- beginWork(): Promise<void>
  - เปิด Transaction (Begin)
- commitWork(): Promise<void>
  - ยืนยัน Transaction (Commit)
- rollbackWork(): Promise<void>
  - ยกเลิก Transaction (Rollback)
- reset(): void
  - คืนค่าสถานะให้กลับสู่รูปแบบเริ่มต้น
- close(): void
  - ปิดการเชื่อมต่อ Connection
- end(): void
  - ทำลายหรือปิดระบบ Pool

---

### KnDBConnections
ใช้สำหรับสร้าง Database Connection ของแต่ละระบบฐานข้อมูล ผ่านตัวเลือก Config

**Functions:**
- static getDBConnector(configure?: string | [KnDBConfig](#kndbconfig)): [KnDBConnector](#kndbconnector)
  - ฟังก์ชัน Factory สำหรับแปลงการตั้งค่า (Config) ให้ออกมาเป็น Instance การทำงานของฐานข้อมูลแต่ละยี่ห้อ เช่น MySQLDB, MsSQLDB, PgSQLDB, OracleDB โดยพิจารณาค่าจาก field ชื่อว่า alias

*(นอกจากนี้ยังมีฟังก์ชัน Global ตัวช่วยคือ `getDBConnector(section: string)` ซึ่งทำหน้าที่เหมือนกับ `KnDBConnections.getDBConnector()` ทุกประการ)*

---

### KnDBError
ทำหน้าที่แสดงข้อผิดพลาด (Exception / Error) ระดับทั่วไปที่เกิดจากฝั่ง Database

**Constructor:**
- constructor(message: string, code?: number, state?: string)

**Properties:**
- code?: number : รหัสแสดงข้อผิดพลาดของฐานข้อมูล
- state?: string : รหัส State ย่อยของ error (ถ้ามี)

---

### KnDBFault
ทำหน้าที่แสดงข้อผิดพลาดประเภทร้ายแรงหรือ Fault Error ที่ฝั่ง Database (extends Error)

**Constructor:**
- constructor(message: string, code: number, state?: string)

**Properties:**
- code: number : รหัสแสดงความล้มเหลว
- state?: string : รหัส State ย่อย (ถ้ามี)

---

### KnDBLibrary
รวบรวมฟังก์ชันสำหรับดึงสถานะหรือข้อมูลจำเพาะจากฐานข้อมูลแต่ละ Driver

**Functions:**
- static getDBVersionQuery(config: [KnDBConfig](#kndbconfig)): string
  - จ่ายคืนค่าประโยค SQL สำหรับเช็ค Database Server Version ที่เหมาะสมตาม Dialect ที่เลือก
- static getDBVersion(db: [KnDBConnector](#kndbconnector), config: [KnDBConfig](#kndbconfig)): Promise<string>
  - ประมวลผลและดึงค่าเวอร์ชันของฐานข้อมูลกลับมาโดยตรง 
- static getQueryTimestamp(config: [KnDBConfig](#kndbconfig)): string
  - จ่ายคืนค่าประโยค SQL สำหรับเช็คเวลาในตัว Server ฐานข้อมูลแต่ละประเภท
- static getServerTimestamp(db: [KnDBConnector](#kndbconnector), config: [KnDBConfig](#kndbconfig)): Promise<Date | undefined>
  - ประมวลผลดึงเวลาปัจจุบันในเครื่อง Database Server คืนผลลัพธ์เป็น Date object

---

### KnDBUtils
Utility class ที่ใช้แปลและแปลงชนิดข้อมูลให้ทำงานข้ามไปมาระหว่าง Driver

**Functions:**
- static parseDBTypes(type: string | [KnDBTypes](#enums)): [KnDBTypes](#enums)
  - แปลงสติงประเภทข้อมูล ให้กลายเป็น Enumerator ประเภทที่รองรับได้
- static parseDBAlias(alias: string | [KnDBAlias](#enums)): [KnDBAlias](#enums)
  - แปลงสติงนามแฝงฐานข้อมูลเป็นระบบ Enum อ้างอิง 
- static parseDBDialect(dialect: string | [KnDBDialect](#enums)): [KnDBDialect](#enums)
  - แปลงหมวด Dialect 
- static parseSQLOptions(query: string | [KnSQLOptions](#knsqloptions)): [KnSQLOptions](#knsqloptions) | undefined
  - ตรวจสอบและดึง SQL Option object จากพารามิเตอร์ที่เป็นสตริงได้
- static parseParamValue(param: [KnDBValue](#kndbvalue), dialect?: string): any
  - จัดแจง Data type ปัจจุบันให้พร้อมส่งเข้าไปในระดับ Database Driver
- static getQuery(query: string | [KnSQLOptions](#knsqloptions)): string
  - ดึงเฉพาะสตริง query string ออกมา
- static extractDBParam(params?: [KnDBParam](#kndbparam), dialect?: string): [any, string[], string[]]
  - แกะโครงสร้าง parameter เป็นลิสต์ array ของ value, array ของชื่อ (names) และ array ของ datatype
- static isSQLInterface(element: unknown): boolean
  - ใช้เพื่อตรวจเช็คว่า Object เป็นประเภทของ `KnSQLInterface` หรือไม่
- การ Validation ตรวจสอบรุ่นฐานข้อมูล (isMYSQL(), isDB2(), isMSSQL(), isINFORMIX(), isORACLE(), isPOSTGRES(), และ isSQLITE()) ทุกฟังก์ชันรับ parameter เป็น `[KnDBConfig](#kndbconfig)`
- static hasIntensiveQuery(query: string | undefined | null): boolean
  - เช็คว่า Query นั้นมีการใช้ชุดคำสั่งที่แก้ไขโครงสร้างตารางหรือลบเนื้อหาแบบอันตราย หรือไม่ (เช่น insert, drop, truncate, alter)

---

### KnSQL
คลาสสำหรับจัดการชุดคำสั่ง SQL แบบ Programmatic เพื่อผูกมัดหรือผูก Parameters ผ่าน Interface ได้อย่างง่ายดาย

**Functions:**
- clear(): [KnSQLInterface](#knsqlinterface)
  - ล้างคำสั่ง SQL และ Parameters
- clearParameter(): [KnSQLInterface](#knsqlinterface)
  - ล้างเฉพาะ Parameters ที่ตั้งค่าไว้ 
- append(sql: string): [KnSQLInterface](#knsqlinterface)
  - ต่อท้ายคำสั่งด้วยประโยคใหม่
- set(paramname: string, paramvalue: string | number | boolean | bigint | null | undefined | Date | Buffer | [KnDBParamValue](#kndbparamvalue), paramtype?: [KnDBTypes](#enums)): [KnSQLInterface](#knsqlinterface)
  - ส่งค่า Parameter เข้าไปในชื่อตัวแปรที่ตรงกับชื่อในประโยคคำสั่ง
- param(name: string): [KnDBValue](#kndbvalue)
  - โหลดและดึงค่า Configuration ของพารามิเตอร์นี้ 
- getExactlySql(alias?: string | [KnDBAlias](#enums)): [string, string[]]
  - แปลงชุดคำสั่งและ Parameters ให้เข้ากับระบบ Dialect ของ Database นั้น ๆ (เช่น แปลงเป็น `$1` `?` หรือ `@param`)
- parameters(names: string[]): any
  - โหลด Array ของค่าข้อมูลเพียว ๆ 
- getDBParam(names: string[]): [KnDBParam](#kndbparam)
  - เรียก object `KnDBParam` ชุดเต็ม ตามชื่อตัวแปรที่มีใน Array
- getSQLOptions(db: [KnDBConnector](#kndbconnector)): [[KnSQLOptions](#knsqloptions), [KnDBParam](#kndbparam)]
  - ส่งข้อมูลประโยคและ parameters กลับเป็นรูปแบบ Tuple สำหรับนำไป query ต่อ
- executeQuery(db: [KnDBConnector](#kndbconnector), ctx?: any, params?: Array<any>): Promise<[KnResultSet](#knresultset)>
  - สั่ง Execute ตัวมันเองโดยอิงจาก connector เป็นตระกูล Query  (SELECT)
- executeUpdate(db: [KnDBConnector](#kndbconnector), ctx?: any, params?: Array<any>): Promise<[KnResultSet](#knresultset)>
  - สั่ง Execute ตัวมันเองโดยอิงจาก connector เป็นตระกูล Update (INSERT/UPDATE/DELETE)

---

### KnDBConnector
Interface รวบรวมฟังก์ชันมาตรฐานที่ Database connector ทุกตัวจะต้องมีและ Implement เพื่อให้การทำงานรูปแบบเดียวกันในทุก ๆ Dialect

**Properties:**
- readonly alias: [KnDBAlias](#enums)
- readonly dialect: string
- readonly config: [KnDBConfig](#kndbconfig)

**Functions:**
- init(): Promise<void>
- getConnection(): Promise<any>
- executeQuery(sql: string | [KnSQLOptions](#knsqloptions), params?: [KnDBParam](#kndbparam) | Array<any>): Promise<[KnResultSet](#knresultset)>
- executeUpdate(sql: string | [KnSQLOptions](#knsqloptions), params?: [KnDBParam](#kndbparam) | Array<any>): Promise<[KnResultSet](#knresultset)>
- execQuery(sql: [KnSQLInterface](#knsqlinterface)): Promise<[KnResultSet](#knresultset)>
- execUpdate(sql: [KnSQLInterface](#knsqlinterface)): Promise<[KnResultSet](#knresultset)>
- beginWork(): Promise<void>
- commitWork(): Promise<void>
- rollbackWork(): Promise<void>
- reset(): void
- close(): void
- end(): void

---

### KnSQLInterface
Interface ต้นแบบสำหรับการสร้างคำสั่ง SQL และผูก Parameters เพื่อการประมวลผลที่สะดวก

**Properties:**
- params : Map<string, [KnDBValue](#kndbvalue)>

**Functions:**
- clear(): [KnSQLInterface](#knsqlinterface)
- clearParameter(): [KnSQLInterface](#knsqlinterface)
- append(sql: string): [KnSQLInterface](#knsqlinterface)
- set(paramname: string, paramvalue: string | number | boolean | bigint | null | undefined | Date | Buffer | [KnDBParamValue](#kndbparamvalue), paramtype?: [KnDBTypes](#enums)): [KnSQLInterface](#knsqlinterface)
- param(name: string): [KnDBValue](#kndbvalue)
- executeQuery(db: [KnDBConnector](#kndbconnector), ctx?: any, params?: Array<any>): Promise<[KnResultSet](#knresultset)>
- executeUpdate(db: [KnDBConnector](#kndbconnector), ctx?: any, params?: Array<any>): Promise<[KnResultSet](#knresultset)>
- getSQLOptions(db: [KnDBConnector](#kndbconnector)): [[KnSQLOptions](#knsqloptions), [KnDBParam](#kndbparam)]

---

## Constants & Variables

### KnDBVariable
เป็นการกำหนดค่าตั้งต้นสำหรับการเข้าถึงฐานข้อมูล ใช้การผูกเข้ากับ Environment variables ของ Node.js ได้แก่
- DB_SCHEMA   (default: "TESTDB")
- DB_URL
- DB_ALIAS    (default: "mysql")
- DB_DIALECT  (default: "mysql")
- DB_USER
- DB_PASSWORD

---

## Data Structures & Types

ข้อมูลโครงสร้างเหล่านี้ มีเป้าหมายสำหรับเป็น Type definition และ Parameter แบบ Nested structures.

### Enums
- **KnDBAlias**: ชื่อของ Database `MYSQL`, `MSSQL`, `ODBC`, `ORACLE`, `POSTGRES`, `SQLITE`, `MYSQL2`
- **KnDBDialect**: Dialect syntax ของ Database `MYSQL`, `MSSQL`, `ORACLE`, `POSTGRES`, `INFORMIX`, `DB2`, `SQLITE`
- **KnDBTypes**: ประเภทข้อมูลที่รองรับ `STRING`, `INTEGER`, `DECIMAL`, `BOOLEAN`, `BIGINT`, `TEXT`, `DATE`, `TIME`, `DATETIME`, `BLOB`, `CLOB`

---

### KnDBConfig
เป็น Nested Structure ระดับบนสุดสำหรับการตั้งค่าระบบฐานข้อมูล
```typescript
interface KnDBConfig {
    schema: string;
    alias: string;     // อ้างอิงจากแบบ KnDBAlias
    dialect: string;   // อ้างอิงจากแบบ KnDBDialect
    url: string;
    user: string;
    password: string;
    host?: string;
    port?: number;
    database?: string;
    options?: any;
}
```

### KnDBValue
โครงสร้างสำหรับจัดเก็บค่าที่ใช้ผูกติดกับ Parameter ในประโยค SQL 
```typescript
interface KnDBValue {
    value: (string | number | boolean | bigint | null | undefined | Date | Buffer),
    type: [KnDBTypes](#enums) 
}
```

### KnDBParam
Structure แบบ Hash Map ที่ใช้ชื่อตัวแปรเป็น Key และเก็บค่าลักษณะ object [`KnDBValue`](#kndbvalue) ในส่วน Value เป็น Nested mapping Data structure
```typescript
interface KnDBParam {
    [name: string] : [KnDBValue](#kndbvalue);
}
```

### KnDBParamValue
เป็น Class รูปแบบหนึ่งที่ implement interface [`KnDBValue`](#kndbvalue) เต็มตัว นำไปสร้างแทน object ตรง ๆ ได้
มี Constructor รูปแบบดังนี้:
```typescript
constructor(
    public value: (string | number | boolean | bigint | null | undefined | Date | Buffer), 
    public type: KnDBTypes = KnDBTypes.STRING
)
```

### KnPageOffset
ข้อมูลที่ประมวลผลจากการแบ่งหน้าข้อมูล Pagination เวลา Query Database
```typescript
interface KnPageOffset {
     page: number;         // หมายเลขของหน้า
     rowsPerPage: number;  // จำนวนบรรทัดข้อมูลต่อหน้า
     totalRows: number;    // จำนวนข้อมูลทั้งหมดจากการ Query
     totalPages: number;   // จำนวนหน้ารวมทั้งหมด
     limit: number;        // ลิมิตของจำนวนการ fetch จริงในคำสั่ง SQL
     offset: number;       // การเริ่มอ่านข้อมูลหรือข้ามข้อมูลจำนวนตามตัวแปรนี้
}
```

### KnResultSet
ข้อมูลชุดผลลัพธ์จากการ Query พร้อมระบบฝัง Pagination ไว้ในตัวเป็น โครงสร้างแบบ Nested ดูรายละเอียด: [`KnPageOffset`](#knpageoffset)
```typescript
interface KnResultSet {
    rows: any;
    columns: any;
    offsets?: KnPageOffset; // => อ้างอิง Nested schema ชื่อว่า KnPageOffset
}
```

### KnRecordSet
โครงสร้างที่สืบทอดมาจาก [`KnResultSet`](#knresultset) เพื่อใช้รับค่าตอบกลับกรณีที่เป็นคำสั่ง Update, Insert หรือ Delete รวมถึงบอกจำนวนแถวที่ถูก Modify เอาไว้ใน records
```typescript
interface KnRecordSet extends KnResultSet {
    records: number; 
}
```

### KnSQLOptions
Options พิเศษที่ใช้สำหรับการบรรจุเป็นส่วนๆ ของการส่ง Query เข้าสู่ Execution process ของฐานข้อมูล
```typescript
interface KnSQLOptions {
    sql: string;      // ประโยค Database คำสั่ง Query
    options?: any;    // ข้อมูล Config พิเศษเสริมเพิ่มเติมตามที่ Driver ฐานข้อมูลจะรองรับ
}
```
